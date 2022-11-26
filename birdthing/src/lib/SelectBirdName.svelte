<script lang="ts">
    let band_num:string;
    let nick:string;
    export let item = undefined;	
	export let isActive = false;
    export let isFirst = false;
	export let isHover = false;

    $: if (item) {band_num = item.band_num}
    $: if (item) {nick = item.nick}

    let itemClasses = '';
    $: {
		const classes = [];
		
		if (isActive) {
			classes.push('active');
		}
		if (isFirst) {
			classes.push('first');
		}
		if (isHover) {
			classes.push('hover');
		}
		itemClasses = classes.join(' ');
	}
</script>

<style>
    #name {
        padding: 0.8em;
        margin: 0;
    }

    #name.active {
        border-left: 4px solid var(--emph-light);
    }

    #name.hover, #name.active {
        background: var(--bg-light);
    }

    #name > * {
        margin: 0;
    }

    #bandnum {
        font-size: 1em;
        margin-right: 0.2em;
    }

    #nick {
        font-size: 0.8em;
        color: var(--deemph-light);
    }
</style>

<p id="name" class="{itemClasses}">
    <span id="bandnum">{band_num}</span>
    <span id="nick">{nick ? "\"" + nick + "\"" : ""}</span>
</p>