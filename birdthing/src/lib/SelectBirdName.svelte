<script lang="ts">
	import type { Bird } from "./bird";


    let band_num:string | undefined;
    let nick:string | undefined;
    export let item:Bird;	
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
    #grid {
        padding: 1em;
        margin: 0;
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: row;
    }

    #grid.active {
        border-left: 4px solid var(--emph-light);
        padding-left: calc(1em - 4px);
    }

    #grid.hover, #grid.active {
        background: var(--bg-light);
    }

    #grid > * {
        flex: 1;
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

<div on:click on:keypress id="grid" class="{itemClasses}">
    <div class="gridrow">
        <span id="bandnum">{band_num}</span>
        <span id="nick">{nick ? "\"" + nick + "\"" : ""}</span>
    </div>
    <span>{item.date_of_birth}</span>
    <span>{item.date_of_death ? item.date_of_death : ""}</span>
    <span>{item.male ? "Male": "Female"}</span>
</div>