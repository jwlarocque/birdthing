<script lang="ts">
    import { createDialog, melt } from '@melt-ui/svelte'

    export let alert = false;

    const {
        elements: { trigger, portalled, overlay, content, title, description, close },
        states: { open }
    } = createDialog({
        role: alert ? "alertdialog" : "dialog",
        closeOnOutsideClick: false,
        closeOnEscape: false
    })
</script>

<style>
    #overlay {
        z-index: 50;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--transparent-light);
        margin: 0;
    }

    .content {
        z-index: 51;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        border-radius: var(--main-radius);
        background-color: var(--bg-light);
        box-shadow: var(--main-shadow);
        padding: 2em;
    }

    .content > h2 {
        margin-top: 0;
    }

    .controls {
        display: flex;
        flex-direction: row;
        margin-top: 2em;
        gap: 1em;
        float: right;
    }
</style>

<span use:melt={$trigger}><slot name="open"></slot></span>
 
<div use:melt={$portalled}>
  {#if $open}
    <div id="overlay" use:melt={$overlay}/>
    <div class="content" use:melt={$content}>
        <h2 use:melt={$title}><slot name="title"></slot></h2>
        <p use:melt={$description}><slot name="description"></slot></p>
        <div class="controls">
            <span use:melt={$close}><slot name="close"></slot></span>
            <span use:melt={$close}><slot name="confirm"></slot></span>
        </div>
    </div>
  {/if}
</div>