<script>
    import Nav from "$lib/components/Nav.svelte";
</script>

<div class="bg-gradient"></div>

<main>
    <Nav/>
    <slot/>
</main>

<style>
    :global(:root) {
        --main-radius: 8px;

        --bg-dark: rgb(35, 34, 36);
        --bg-dark-alternate: rgb(62, 61, 64);
        --header-dark: rgb(215, 219, 224);
        --header-dark-selected: rgb(235, 237, 240);
    }

    :global(body, html) {
        margin: 0;
        padding: 0;
    }

    :global(body) {
        top: 0;
        font-family: sans-serif;
    }

    main {
        width: calc(100vw - 2em);
        max-width: 100em;
        margin: auto;
    }

    .bg-gradient {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        top: 0;
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: -10;
        
        background:
        /* radial-gradient(farthest-corner at 20% 20%, rgb(238,215,163, 0.8), transparent), */
        linear-gradient(to bottom right, rgba(238,215,163, 0.2), transparent),
        linear-gradient(to top left, rgba(7,65,39, 1), transparent),
        linear-gradient(to top right, rgba(1,18,55, 0.8), transparent);
        background-blend-mode: screen;
    }

    :global(.horiz-content) {
        display: flex;
        flex-direction: row;
    }

    :global(.horiz-content>*) {
        margin: 0 0.5em;
    }

    :global(.horiz-content>*:first-child) {
        margin: 0 0.5em 0 0;
    }

    :global(.horiz-content>*:last-child) {
        margin: 0 0 0 0.5em;
    }
</style>
