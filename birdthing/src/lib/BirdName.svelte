<script lang="ts">
    export let band_num:string;
    export let nick:string;
</script>

<style>
    #name {
        margin: 1em;
    }

    #name > * {
        margin: 0;
    }

    #bandnum {
        font-size: 1.2em;
        margin-right: 0.2em;
    }

    #nick {
        color: var(--deemph-light);
    }
</style>

<p id="name">
    <span id="bandnum">{band_num}</span>
    <span id="nick">{nick ? "\"" + nick + "\"" : ""}</span>
</p>