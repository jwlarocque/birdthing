<script lang="ts">
	import type { TreeNode } from "$lib/bird";
	import BirdName from "$lib/BirdName.svelte";


    export let tree:TreeNode|null;
    let color = '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
</script>

<style>
    #main {
        display: flex;
        flex-direction: column;
        justify-content: end;
    }

    #this, #children, #parents {
        display: flex;
        flex-direction: row;
        gap: 1em;
        justify-content: space-around;
    }
</style>

{#if tree}
    <div id="main">
        <div id="parents">
            {#each tree.parents as parent}
                <svelte:self tree={parent}/>
            {/each}
        </div>
        <div id="this">
            <slot name="individual">
                <BirdName bird={tree.item} link={false}/>
            </slot>
        </div>
        <div id="children">
            {#each tree.children as child}
                <svelte:self tree={child}/>
            {/each}
        </div>
    </div>
{/if}