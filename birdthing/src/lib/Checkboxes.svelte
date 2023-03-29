<script lang="ts">
    export let items:string[] = [];
    export let selected:any[] = [];
    let show = false;
    let selections = new Map<string, boolean>();
    $: selected = [...selections.keys()].filter(key => selections.get(key) == true);
</script>

<style>
    #main {
        position: relative;
        display: flex;
        cursor: pointer;
        user-select: none;
    }

    .toggler {
        z-index: 1;
    }

    .row {
        display: flex;
        flex-direction: row;
        padding: 0 1em;
    }

    .row > svg {
        margin: auto;
    }

    #options {
        padding-top: 3em;
        position: absolute;
        width: 100%;
    }

    .flipper {
        transition: all .2s ease-out;
    }

    .flipped {
        transform: rotate(-180deg);
    }

    .checkbox {
        width: 1em;
        height: 1em;
        border: 1px solid var(--field-border-light);
        border-radius: var(--field-radius);
        margin: auto 1em auto 0;
        display: flex;
        flex-direction: column;
    }

    .checked {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        background-color: var(--emph-light);
        border-radius: 2px;
        margin: auto;
    }
</style>

<div id="main" class={show ? "" : "card"} on:click={() => show = !show} on:keypress={() => show = !show}>
    <div class="row toggler">
        <slot name="label"></slot>
        <svg class={show ? "flipper flipped" : "flipper"} xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 96 960 960" width="2em"><path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"/></svg>
    </div>
    {#if show}
        <div id="options" class="card">
            {#each items as item}
                <div
                    class="row"
                    on:click|stopPropagation={() => {selections.set(item, !selections.get(item)); selections = selections;}}
                    on:keypress|stopPropagation={() => {selections.set(item, !selections.get(item)); selections = selections;}}
                >
                    <div class="checkbox">
                        {#if selections.get(item)}
                            <div class="checked"></div>
                        {/if}
                    </div>
                    <p>{item}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>