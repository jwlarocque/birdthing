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

    :global(body) {
        max-width: 80em;
        margin: auto;
    }

    :global(body > * > *) {
        margin: 1em 0;
    }

    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<nav>
    <h1>Birdthing</h1>
</nav>

<slot></slot>