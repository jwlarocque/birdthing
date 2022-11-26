<script lang="ts">
    import {fly} from 'svelte/transition';
    import {flip} from 'svelte/animate';

    import Loading from '$lib/Loading.svelte';

    import BirdDetail from '$lib/BirdDetail.svelte';
    import BirdList from '$lib/BirdList.svelte';
	import EditBird from '$lib/EditBird.svelte';

    let birds = [];

    let selectedId = null;

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
    :global(:root) {
        --main-radius: 8px;
        --field-radius: 3px;
        --main-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.26);
        --bg-light: rgb(240, 237, 235);
        --border-light: rgb(21, 14, 9);
        --section-header-light: rgb(145, 141, 134);
        --emph-light: rgb(238, 64, 53);
        --deemph-light: rgb(182, 76, 59);
        --field-border-light: rgb(216, 219, 223);
        --male-light: rgb(133, 164, 212);
        --female-light: rgb(212, 133, 196);
    }

    :global(body, html) {
        margin: 2em;
        padding: 0;
        font-family: 'Merriweather', 'Arial';
        background-color: var(--bg-light);
    }

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

    button#reset {
        margin: 4em 0;
    }
</style>

<header>
    <h1>Birdthing</h1>
</header>
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

<button id="reset" on:click={() => selectedId = null}>reset</button>

<EditBird/>
