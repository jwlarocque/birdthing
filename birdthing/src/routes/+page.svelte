<script lang="ts">
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';

    import Loading from '$lib/Loading.svelte';

    import BirdDetail from '$lib/BirdDetail.svelte';
    import BirdList from '$lib/BirdList.svelte';
	import EditBird from '$lib/EditBird.svelte';

    let birds = [];

    let selectedId = null;

    let showNew = false;

    // TODO: move to to .ts file
    async function loadBirds() {
        const res = await fetch("api/birds");
        const json = await res.json();
        if (res.ok) {
            birds = await json;
        } else {
            throw new Error(birds);
        }
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
            <BirdList bind:birds bind:selectedId></BirdList>
        {:catch error}
            <p>error: {error}</p>
        {/await}
    </div>
    <div id="display">
        <BirdDetail bind:selectedId/>
    </div>
</div>
