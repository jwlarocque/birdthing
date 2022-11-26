<script lang="typescript">
    export let birds:Array<Object>;
    export let selectedIndex:Number = 0;
</script>

<main>
    {#each birds as bird, i}
        <div class="listItem" id={selectedIndex == i ? "selected" : ""} on:click="{e => selectedIndex = i}">
            <p>{bird.band_num}</p>
        </div>
    {/each}
</main>

<style>
    main {
        color: var(--header-dark);
        background-color: var(--bg-dark);
        border-radius: var(--main-radius);

        width: 20%;
        height: 0%;
        min-width: 26em;

        padding: 0.5em 0;
    }

    .listItem {
        padding: 0.5em 1em;
        border-bottom: 1px solid var(--header-dark);
        cursor: pointer;
        user-select: none;
    }

    .listItem:nth-last-child(1) {
        border-bottom: none;
    }

    .listItem#selected {
        background-color: var(--bg-dark-alternate);
    }
</style>