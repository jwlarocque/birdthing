<script lang="ts">
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';

    import {supabase} from '$lib/supabase.js';

    import Loading from '$lib/Loading.svelte';

    import BirdDetail from '$lib/BirdDetail.svelte';
    import BirdList from '$lib/BirdList.svelte';
	import EditBird from '$lib/EditBird.svelte';
	import type { Bird } from '$lib/bird';

    let birds:Bird[] = [];

    let selectedId:number;

    let showNew = false;

    // TODO: move to to .ts file
    async function loadBirds() {
        const {data} = await supabase.from("bird").select();
        console.log(data);
        birds = data as Bird[] ?? [];
        return birds;
    }
</script>

<style>
    #main {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1em;
    }

    #main > * {
        transition: all ease-in-out 1s;
    }

    #select {
        flex: 0 1 auto;
        display: flex;
        max-width: 100%;
    }

    #display {
        flex: 1 1 auto;
    }

    :global(button) {
        border-radius: var(--field-radius);
        border: 1px solid var(--field-border-light);
        font-family: "Merriweather", "Arial";
        font-size: 1em;
        padding: 0.6em 1.2em;
        box-sizing: border-box;
        width: fit-content;
        height: fit-content;
        margin: auto 0;
        cursor: pointer;
    }
</style>

<button on:click={() => showNew = !showNew}>{showNew ? "Cancel" : "New Bird"}</button>
{#if showNew}
    <EditBird/>
{/if}
<div id="main">
    <div id="select">
        {#await loadBirds()}
            <Loading/>
        {:then}
            <!-- TODO: put loading indicator within list/card -->
            <BirdList bind:birds bind:selectedId></BirdList>
        {:catch error}
            <p>error: {error}</p>
        {/await}
    </div>
    <div id="display">
        <BirdDetail bind:selectedId/>
    </div>
</div>
