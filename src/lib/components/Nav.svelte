<script>

</script>

<main>
    <div id="title">
        <h1>BirdThing</h1>
    </div>

    <ul id="nav-right">
        <li><h3>test</h3></li>
        <li><h3>wow</h3></li>
    </ul>
</main>

<style>
    main {
        margin: 1em 0;
        padding: 0 1em;
        
        border-radius: var(--main-radius);
        background-color: var(--bg-dark);
        color: var(--header-dark);

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #nav-right {
        display: flex;
        flex-direction: row;
    }

    ul#nav-right {
        margin: 0;
        list-style: none;

        cursor: pointer;
    }

    #nav-right > * {
        margin: 0;
        padding: 1em;
        box-sizing: border-box;
        text-align: center;

        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    #nav-right > *:hover {
        color: var(--header-dark-selected);
    }

    #nav-right li > * {
        margin: 0;
    }
</style>