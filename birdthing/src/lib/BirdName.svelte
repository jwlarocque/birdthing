<script lang="ts">
    import type {Bird} from '$lib/bird';
    export let bird:Bird;
    export let editable:boolean = false;
    export let link:boolean = true;
    export let editing = false;

    $: birdPath = `/birds/${bird.id}`

</script>

<style>
    #name {
        margin: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    #name > a {
        margin: 0;
        display: flex;
        align-items: center;
    }

    #bandnum {
        font-size: 1.2em;
        margin-right: 0.2em;
    }

    #nick {
        color: var(--deemph-light);
    }

    #clickable {
        height: 100%;
        display: flex;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        display: inline-block;
    }
</style>

<div id="name">
    <a id="clickable" title="View in New Tab" href={birdPath}>
        <span id="bandnum">{bird.band_num}</span>
        <span id="nick">{bird.nick ? "\"" + bird.nick + "\"" : ""}</span>
    </a>
    {#if editable}
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 48 48" height="1.2em"><path fill="rgb(145, 141, 134)" d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/></svg>
            <span>Edit</span> <!-- use a span to wrap the text -->
        </button>
    {:else if link}
        <a id="clickable" title="View in New Tab" href={birdPath} target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="10 10 26 26" height="0.8em"><path fill="rgb(145, 141, 134)" d="m12.4 35.7-2.1-2.1L30.9 13H12v-3h24v24h-3V15.1Z"/></svg>
        </a>
    {/if}
</div>