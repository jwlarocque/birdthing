<script lang="ts">
	import { error } from "@sveltejs/kit";
    import { createEventDispatcher, onMount } from "svelte";

	import Select from "svelte-select";

    import BirdPeek from "./BirdPeek.svelte";
    import BirdName from "./BirdName.svelte";
    import { loadBird, constructFamily, searchBirds, updateBird, deleteBird, type Bird } from "./bird";
	import Loading from "./Loading.svelte";
    import SelectBirdName from "./SelectBirdName.svelte";
	import FamilyTree from "./svelte-family-tree/FamilyTree.svelte";
	import Dialogue from "./Dialogue.svelte";


    let bird:Bird|null;
    $: birdPath = bird ? `/birds/${bird.id}` : "";
    export let selectedId:string|null = null;
    $: retrieveBird(selectedId)
    export let editable = true;
    export let link = true;

    const dispatch = createEventDispatcher();

    let editing = false;
    let saving = false;
    let saveError;
    let phantom:Bird;
    let phantom_mother:Bird|null;
    $: updatePhantomParent("mother", phantom_mother);
    let phantom_father:Bird|null;
    $: updatePhantomParent("father", phantom_father);
    let male_group:string; // lol

    const parent_depth = 2;

    async function retrieveBird(id:string|null) {
        if (id) {
            bird = await loadBird(id);
            resetPhantom();
        }
    }

    async function deleteBirdRefresh() {
        if (selectedId) {
            await deleteBird(selectedId);
            dispatch("birdDeleted");
        }
    }

    function resetPhantom() {
        if (bird) {
            phantom = structuredClone(bird) as Bird;
            male_group = phantom.male ? "true" : "false";
            phantom_mother = phantom?.mother;
            phantom_father = phantom?.father;
        }
    }

    function updatePhantomFromMaleGroup() {
        if (male_group === "true") {
            phantom.male = true;
        } else {
            phantom.male = false;
        }
    }

    function updatePhantomParent(parent:string, candidate:Bird|null) {
        if (!phantom) { return; }
        if (!candidate) { candidate = null; }
        if (parent === "mother") {
            phantom.mother = candidate;
        } else if (parent === "father") {
            phantom.father = candidate;
        }
    }

    async function savePhantom() {
        if (saving) {
            return;
        }
        saving = true;
        let success = await updateBird(phantom);
        // TODO: show status
        if (success) {
            // TODO: awk
            bird = await loadBird(success.id);
            editing = false;
        }
        saving = false;
    }

    // TODO: duplicates functionality with EditBird; consolidate?
    function searchBirdsParent(male:boolean, excludeId:string) {
        return function search(options:any) {
            return searchBirds({"band_num": options, "male": male, "!id": excludeId}, false);
        }
    }

    let itemFilter = (label:string, filterText:string, option:string) => true;
</script>

<style>
    #main {
        flex: 0 1 auto;
        min-height: 6em;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: 0.6em;
    }

    #main > * {
        flex: 0 1 auto;
        margin: 0 1em;
    }

    #main > *:last-child {
        margin-bottom: 1em;
    }

    #unselected {
        text-align: center;
        margin: 1em;
    }

    section > header {
        /* border-bottom: 1px solid var(--section-header-light); */
        margin: 1em 0;
    }

    section > header, .miniheader {
        color: var(--section-header-light);
    }

    .miniinfo {
        display: grid;
        grid-template-columns: repeat(2, max-content);
    }

    .miniinfo > * {
        margin: 0.4em;
        display: flex;
        align-items: center;
    }

    .miniinfo > *:nth-child(2n - 1) {
        margin: 0;
    }
    
    #name {
        margin: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #name > a {
        margin: 0;
        display: flex;
        align-items: center;
    }

    #bandnum {
        font-size: 1.2em;
        margin-right: 0.2em;
    }

    input#bandnum, input.nick {
        border: none;
        border-bottom: 1px solid var(--section-header-light);
        max-width: 8em;
        vertical-align: bottom;
    }

    .nick {
        color: var(--deemph-light);
    }

    #top-buttons {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }

    .delete {
        border-color: var(--emph-light);
    }

    .delete-confirm {
        background-color: var(--emph-light);
        color: var(--bg-light);
    }

    #clickable {
        height: 100%;
        display: flex;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        display: inline-block;
    }

    #ancestry {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 1em;
    }

    .date {
        font-size: inherit;
        padding: 0.2em 0;
        margin: 0.1em 0.2em;
        display: inline-block;
        border: none;
        box-sizing: content-box;
        border-bottom: 1px solid transparent;
        line-height: 1.6em;
    }

    input[type="date"].date {
        border-bottom: 1px solid var(--section-header-light);
    }

    .notes-container {
        display: grid;
    }

    .notes {
        grid-column: 1;
        grid-row: 1;
        min-height: 6em;
        width: 100%;
    }

    .notes > *:first-child {
        margin-top: 0;
    }

    textarea.notes {
        font-size: 1em;
        border-radius: var(--main-radius);
        border-color: var(--field-border-light);
        border-style: solid;
        border-width: 1px;
        resize: vertical;
        width: calc(100% - 1em);
    }

    div.parent-select {
        font-family: "Merriweather" !important;
        --spinnerColor: var(--emph-light);
        --borderFocusColor: var(--emph-light);
        flex: 1 1 0;
    }

    .select-item {
        margin: 0;
    }
</style>

<div id="main" class="card">
    {#if selectedId != null}
        {#if bird}
            <div id="name">
                {#if editing}
                    <div>
                        <input id="bandnum" type="text" placeholder="Band Number" bind:value={phantom.band_num}/>
                        <input class="nick" type="text" placeholder="Nickname" bind:value={phantom.nick}>
                    </div>
                {:else}
                    <a id="clickable" title="View in New Tab" href={birdPath}>
                        <span id="bandnum">{bird.band_num || "<unknown band number>"}</span>
                        <span class="nick">{bird.nick ? "\"" + bird.nick + "\"" : ""}</span>
                    </a>
                {/if}
                <div id="top-buttons">
                    {#if editable}
                        {#if editing}
                            <button on:click={savePhantom}><span>Save</span></button>
                        {:else}
                            <Dialogue>
                                <button slot="open" class="delete">Delete</button>
                                <span slot="title">Confirm Deletion</span>
                                <span slot="description">
                                    <span id="bandnum">{bird.band_num || "<unknown band number>"}</span>
                                    <span class="nick">{bird.nick ? "\"" + bird.nick + "\"" : ""}</span>
                                    will be permanently deleted.
                                </span>
                                <button slot="close">Cancel</button>
                                <button slot="confirm" class="delete delete-confirm" on:click={deleteBirdRefresh}>Delete</button>
                            </Dialogue>
                        {/if}
                        <button on:click={() => {editing = !editing; resetPhantom();}}>
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 48 48" height="1.2em"><path fill="rgb(145, 141, 134)" d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/></svg> -->
                            <span>{editing ? "Cancel" : "Edit"}</span>
                        </button>
                    {/if}
                    {#if link}
                        <a class="button" id="clickable" title="View in New Tab" href={birdPath} target="_blank" rel="noopener noreferrer">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="10 10 26 26" height="0.8em"><path fill="rgb(145, 141, 134)" d="m12.4 35.7-2.1-2.1L30.9 13H12v-3h24v24h-3V15.1Z"/></svg> -->
                            <span>Open in New Tab</span>
                        </a>
                    {/if}
                </div>
            </div>
            <div class="miniinfo">
                <span class="miniheader">Born:</span>
                {#if editing}
                    <!-- TODO: a way to clear these date (died as well) -->
                    <input type="date" class="date" bind:value={phantom.date_of_birth}/>
                {:else}
                    <span class="date">{bird.date_of_birth ? new Date(bird.date_of_birth).toLocaleDateString() : "unknown"}</span>
                {/if}
                <span class="miniheader">Died: </span>
                {#if editing}
                    <input type="date" class="date" bind:value={phantom.date_of_death}/>
                {:else}
                    <span class="date">{bird.date_of_death ? new Date(bird.date_of_death).toLocaleDateString() : ""}</span>
                {/if}
                <span class="miniheader">Sex: </span>
                {#if editing}
                    <!-- TODO: better styling -->
                    <div>
                        <div>
                            <input
                                type="radio"
                                name="male"
                                value="true"
                                required
                                bind:group={male_group}
                                on:change={updatePhantomFromMaleGroup}
                            />
                            <label for="male">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="male"
                                value="false"
                                required
                                bind:group={male_group}
                                on:change={updatePhantomFromMaleGroup}
                            />
                            <label for="female">Female</label>
                        </div>
                    </div>
                {:else}
                    <span>{bird.male != null ? bird.male ? "Male" : "Female" : "Unknown"}</span>
                {/if}
            </div>
            <section>
                <header>Notes:</header>
                <div class="notes-container">
                    <div class={editing ? "notes hidden" : "notes"}>
                            {#if bird.notes}
                                {@html bird.notes}
                            {:else}
                                <p>{"No notes yet."}</p>
                            {/if}
                    </div>
                    <textarea class={editing ? "notes" : "notes hidden"} bind:value={phantom.notes}/>
                </div>
            </section>
            <section>
                <header>Ancestry:</header>
                {#if editing}
                    <div class="soft-row">
                        <!-- TODO: duplicates code in EditBird, consolidate or at least use an #each for mother and father -->
                        <div class="parent-select">
                            <span>Father</span>
                            <Select
                                loadOptions={searchBirdsParent(true, phantom.id)}
                                itemFilter={itemFilter}
                                itemId={"id"}
                                placeholder={"Please Select"}
                                bind:value={phantom_father}
                            >
                                <p class="select-item" slot="item" let:item>
                                    {item.band_num}
                                    {#if item.nick}
                                        <span class="nick">({item.nick})</span>
                                    {/if}
                                </p>
                                <p class="select-item" slot="selection" let:selection>
                                    {selection.band_num}
                                    {#if selection.nick}
                                        <span class="nick">({selection.nick})</span>
                                    {/if}
                                </p>
                            </Select>
                        </div>
                        <div class="parent-select">
                            <span>Mother</span>
                            <Select
                                loadOptions={searchBirdsParent(false, phantom.id)}
                                itemFilter={itemFilter}
                                itemId={"id"}
                                placeholder={"Please Select"}
                                bind:value={phantom_mother}
                            >
                                <p class="select-item" slot="item" let:item>
                                    {item.band_num}
                                    {#if item.nick}
                                        <span class="nick">({item.nick})</span>
                                    {/if}
                                </p>
                                <p class="select-item" slot="selection" let:selection>
                                    {selection.band_num}
                                    {#if selection.nick}
                                        <span class="nick">({selection.nick})</span>
                                    {/if}
                                </p>
                            </Select>
                        </div>
                    </div>
                {:else}
                    <div id="ancestry">
                        {#if bird.father === null && bird.mother === null}
                            <p>Unknown</p>
                        {:else}
                            {#await constructFamily(bird)}
                                <Loading/>
                            {:then tree}
                                <FamilyTree tree={tree} thisRef={null} main={null}/>
                            {/await}
                        {/if}
                    </div>
                {/if}
            </section>
        {:else}
            <Loading/>
        {/if}
    {:else}
        <p id="unselected">Select a Bird</p>
    {/if}
</div>
