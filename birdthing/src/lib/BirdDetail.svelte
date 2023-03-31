<script lang="ts">
	import { error } from "@sveltejs/kit";
    import BirdPeek from "./BirdPeek.svelte";
    import BirdName from "./BirdName.svelte";
    import { loadBird, type Bird } from "./bird";
	import Loading from "./Loading.svelte";


    let bird:Bird|null;
    $: birdPath = bird ? `/birds/${bird.id}` : "";
    export let selectedId:number|null = null;
    $: updateBird(selectedId)
    export let editable = true;
    export let link = true;
    let editing = false;
    const parent_depth = 2;

    async function updateBird(id:number|null) {
        if (id) {
            bird = await loadBird(id);
        }
    }
</script>

<style>
    #main {
        min-height: 6em;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
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
        border-bottom: 1px solid var(--section-header-light);
        margin: 1em 0;
    }

    section > header, .miniheader {
        color: var(--section-header-light);
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

    #nick {
        color: var(--deemph-light);
    }

    #top-buttons {
        display: flex;
        flex-direction: row;
        gap: 1em;
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
</style>

<div id="main" class="card">
    {#if selectedId != null}
        {#if bird}
            <div id="name">
                <a id="clickable" title="View in New Tab" href={birdPath}>
                    <span id="bandnum">{bird.band_num}</span>
                    <span id="nick">{bird.nick ? "\"" + bird.nick + "\"" : ""}</span>
                </a>
                <div id="top-buttons">
                    {#if editable}
                        {#if editing}
                            <button><span>Save</span></button>
                        {/if}
                        <button on:click={() => editing = !editing}>
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
            <div>
                <span class="miniheader">Born: </span>
                <span>{bird.date_of_birth ? bird.date_of_birth : "unknown"}</span>
            {#if bird.date_of_death}
                <div>
                    <span class="miniheader">Died: </span>
                    <span>{bird.date_of_death}</span>
                </div>
            {/if}
            </div>
            <div>
                <span class="miniheader">Sex: </span>
                <span>{bird.male != null ? bird.male ? "Male" : "Female" : "Unknown"}</span>
            </div>
            {#if bird.notes}
                <section>
                    <header>Notes</header>
                    <div id="notes">
                            <p>{bird.notes}</p>
                    </div>
                </section>
            {/if}
            <section>
                <header>Ancestry</header>
                <div id="ancestry">
                    {#if bird.father_id == null && bird.mother_id == null}
                        <p>Unknown</p>
                    {:else}
                        <BirdPeek id={bird.father_id} recursion_level={parent_depth - 1}/>
                        <BirdPeek id={bird.mother_id} recursion_level={parent_depth - 1}/>
                    {/if}
                </div>
            </section>
        {:else}
            <Loading/>
        {/if}
    {:else}
        <p id="unselected">Select a Bird</p>
    {/if}
</div>
