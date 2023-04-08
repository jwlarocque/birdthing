<script lang="ts">
	import type { TreeNode } from "$lib/bird";
	import BirdName from "$lib/BirdName.svelte";
	import { tick } from "svelte";


    export let tree:TreeNode|null;
    export let main:HTMLDivElement;
    export let thisRef:HTMLDivElement;

    let mainClientWidth:number;
    let mainClientHeight:number;
    let canvas:HTMLCanvasElement;
    $: ctx = canvas ? canvas.getContext("2d") : null;
    $: if (mainClientWidth && mainClientHeight) {handleCanvasResize();};
    let parentMainRefs:HTMLDivElement[] = [];
    let parentRefs:HTMLDivElement[] = [];
    let childMainRefs:HTMLDivElement[] = [];
    let childRefs:HTMLDivElement[] = [];

    function drawEdge(
        ctx:CanvasRenderingContext2D,
        from:HTMLDivElement,
        toContainer:HTMLDivElement,
        to:HTMLDivElement
    ) {
        let fromCenter = [
            from.offsetLeft + from.clientWidth / 2,
            from.offsetTop + from.clientHeight / 2
        ];
        let toCenter = [
            toContainer.offsetLeft + to.offsetLeft + to.clientWidth / 2,
            toContainer.offsetTop + to.offsetTop + to.clientHeight / 2
        ];
        ctx.beginPath();
        // draw first vertical component
        ctx.moveTo(fromCenter[0], fromCenter[1]);
        ctx.lineTo(fromCenter[0], fromCenter[1] - (fromCenter[1] - toCenter[1]) / 2);
        // draw horizontal component
        ctx.lineTo(toCenter[0], fromCenter[1] - (fromCenter[1] - toCenter[1]) / 2);
        // draw second vertical component
        ctx.lineTo(toCenter[0], toCenter[1]);
        ctx.stroke();
    }

    async function handleCanvasResize() {
        await tick();
        if (!canvas || !ctx) {return;};
        ctx.fillStyle = "rgb(200, 0, 0)";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        if(!thisRef) {return;};
        // TODO: remove debug
        let thisCenter = [
            thisRef.offsetLeft + thisRef.clientWidth / 2,
            thisRef.offsetTop + thisRef.clientHeight / 2
        ];
        ctx.fillStyle = "rgb(0, 0, 200)";
        ctx.fillRect(
            thisCenter[0] - 5,
            thisCenter[1] - 5,
            10,
            10
        );
        // TODO: end debug here
        ctx.fillStyle = "rgb(0, 0, 0)";
        for (let i = 0; i < parentRefs.length; i++) {
            drawEdge(ctx, thisRef, parentMainRefs[i], parentRefs[i]);
        }
        for (let i = 0; i < childRefs.length; i++) {
            drawEdge(ctx, thisRef, childMainRefs[i], childRefs[i]);
        }
    }
</script>

<style>
    #main {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1em;
        justify-content: end;
        position: relative;
        background-color: transparent;
    }

    canvas {
        position: absolute;
        z-index: 1;
    }

    #this, #children, #parents {
        display: flex;
        flex-direction: row;
        gap: 1em;
        justify-content: space-around;
        z-index: 2;
    }

    #slot-default {
        border: 1px solid black;
        margin: 0.5em;
        background-color: var(--bg-light);
    }
</style>

{#if tree}
    <div
        id="main"
        bind:this={main}
        bind:clientWidth={mainClientWidth}
        bind:clientHeight={mainClientHeight}
    >
        {#if main}
            <!-- TODO: having a canvas per node is psychotic -->
            <canvas
                bind:this={canvas}
                width={mainClientWidth}
                height={mainClientHeight}
            >
                Canvas element showing connections between birds.
            </canvas>
        {/if}
        <div id="parents">
            {#each tree.parents as parent, i}
                <svelte:self tree={parent} bind:main={parentMainRefs[i]} bind:thisRef={parentRefs[i]}/>
            {/each}
        </div>
        <div id="this" bind:this={thisRef}>
            <slot name="individual">
                <div id="slot-default">
                    <BirdName bird={tree.item} link={false}/>
                </div>
            </slot>
        </div>
        <div id="children">
            {#each tree.children as child, i}
                <svelte:self tree={child} bind:main={childMainRefs[i]} bind:thisRef={childRefs[i]}/>
            {/each}
        </div>
    </div>
{/if}