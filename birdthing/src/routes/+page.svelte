<script lang="ts">
    import Loading from '$lib/Loading.svelte';

    import BirdDetail from '$lib/BirdDetail.svelte';
    import BirdList from '$lib/BirdList.svelte';
	import EditBird from '$lib/EditBird.svelte';
	import { searchBirds, type Bird } from '$lib/bird';

    let birds:Bird[] = [];

    let selectedId:string;

    let showNew = false;

    let getBirds = loadBirds();

    async function loadBirds() {
        birds = await searchBirds({});
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

    #new-bird {
        margin-left: auto;
    }
</style>

<button id="new-bird" class="card" on:click={() => showNew = !showNew}>{showNew ? "Cancel" : "New Bird"}</button>
{#if showNew}
    <!-- TODO: preserve BirdList search when birdCreated -->
    <EditBird on:birdCreated={() => {getBirds = loadBirds()}}/>
{/if}
<div id="main">
    <div id="select">
        {#await getBirds}
            <Loading/>
        {:then}
            <!-- TODO: put loading indicator within list/card -->
            <BirdList bind:birds bind:selectedId></BirdList>
        {:catch error}
            <p>error: {error}</p>
        {/await}
    </div>
    <div id="display">
        <BirdDetail bind:selectedId on:birdDeleted={() => {getBirds = loadBirds()}}/>
    </div>
</div>
