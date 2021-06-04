<script lang="typescript">
    export let bird:Object;
</script>

<main>
    {#if bird}
        <h1>{bird.band_num}{#if bird.nick} "{bird.nick}"{/if}</h1>
        <h3>Owner: TODO</h3>
        <h3>Date of Birth: {bird.date_of_birth}</h3>
        {#if bird.date_of_death}
            <h3>Date of Death: {bird.date_of_death}</h3>
        {/if}
        <p>{bird.notes}</p>
    {:else}
    {/if}
</main>

<style>
    main {
        padding: 1em;
        color: var(--bg-dark);
    }
</style>