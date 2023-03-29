<script lang="ts">
	import { page } from "$app/stores";
	import Select from "svelte-select";
	import type { Bird } from "./bird";
	import BirdName from "./BirdName.svelte";
	import Checkboxes from "./Checkboxes.svelte";
	import SelectBirdName from "./SelectBirdName.svelte";
    import Loading from "./Loading.svelte";

    export let birds:Array<Bird>;
    let selected:Bird;
    export let selectedId:Number|null = null;
    $: selectedId = selected ? selected.id : null;

    // owner_id?: number;
    // male?: boolean;
    // date_of_birth?: string;
    // date_of_death?: string;
    // nick?: string;
    // notes?: string;
    // father_id?: number;
    // mother_id?: number;
    const DEFAULT_COLUMNS = {
        "Band Number": (bird: Bird) => BirdName
    }
    // TODO: enforce order
    const OPTIONAL_COLUMNS:{[index: string]: Function} = {
        "Sex": (bird: Bird) => bird.male === true ? "Male" : bird.male === false ? "Female" : "",
        "Date of Birth": (bird: Bird) => bird.date_of_birth || "",
        "Date of Death": (bird: Bird) => bird.date_of_death || ""
        // TODO: owner (when implemented)
        // TODO: "rating"? (when/if implemented)
    }
    // TODO: store in cookie
    let selected_columns:string[] = [];
</script>

<style>
    #controls {
        display: flex;
        flex-direction: row;
        /* min-width: 30em; */
        gap: 1em;
    }

    .grid {
        display: grid;
        /* overflow: hidden; */
    }

    .grid > .grid-header {
        background-color: var(--bg-light);
        margin: 0;
        padding: 1em;
    }

    .grid > * {
        padding: 1em;
        margin: 0;
    }

    .grid > *:not(.grid-header) {
        cursor: pointer;
        user-select: none;
    }

    .nick {
        color: var(--deemph-light);
        margin-left: 0.2em;
    }
    
    .selected {
        background-color: var(--bg-light);
    }

    .selected.band-num {
        border-left: 4px solid var(--emph-light);
        padding-left: calc(1em - 4px);
    }

    .selected.band-num:last-of-type {
        border-radius: 0 0 0 var(--main-radius);
    }

    .searchbox {
        border: none;
        height: 100%;
        border-radius: var(--main-radius);
        box-sizing: border-box;
        font-size: 1em;
        padding: 0 1em;
        caret-color: var(--section-header-light);
    }

    .searchbox::placeholder {
        color: var(--section-header-light);
    }
</style>

<div class="col">
    <div id="controls">
        <Checkboxes items={Object.keys(OPTIONAL_COLUMNS)} bind:selected={selected_columns}>
            <p slot="label">Show Columns</p>
        </Checkboxes>
        <div class="card">
            <input class="searchbox" type="text" placeholder="Search"/>
        </div>
    </div>
    <div class="card grid" style="grid-template-columns: repeat({1 + selected_columns.length}, 1fr)">
        <p class="grid-header">Band Number</p>
        {#each selected_columns as col_name}
            <p class="grid-header">{col_name}</p>
        {/each}
        {#each birds as bird}
        <!-- TODO: something clever with selected_columns so these can be combined -->
            <div
                class={selected && bird.id === selected.id ? "selected band-num": "band-num"}
                on:click={() => {selected = bird}}
                on:keypress={() => {selected = bird}}
            >
                {bird.band_num}
                {#if bird.nick}
                    <span class="nick">"{bird.nick}"</span>
                {/if}
    </div>
            {#each selected_columns as col_name}
                <p
                    class={selected && bird.id === selected.id ? "selected": ""}
                    on:click={() => {selected = bird}}
                    on:keypress={() => {selected = bird}}
                >
                    {OPTIONAL_COLUMNS[col_name](bird)}
                </p>
            {/each}
        {:else}
            <Loading/>
        {/each}
    </div>
</div>
