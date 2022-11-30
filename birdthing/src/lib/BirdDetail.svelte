<script lang="ts">
	import { error } from "@sveltejs/kit";
    import BirdPeek from "./BirdPeek.svelte";
    import BirdName from "./BirdName.svelte";
    import { loadBird } from "./bird";
	import Loading from "./Loading.svelte";

    export let selectedId:number|null = null;
    export let editable = false;

    const parent_depth = 2;
</script>

<style>
    #main{
        height: 100%;
        background-color: #fff;
        border-radius: var(--main-radius);
        box-shadow: var(--main-shadow);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    #main > * {
        flex: 0 1 auto;
        margin: 0 1em;
    }

    #main > *:last-child {
        margin-bottom: 1em;
    }

    #unselected {
        text-align: center;
        margin: 1em;
    }

    section > header {
        border-bottom: 1px solid var(--section-header-light);
        margin: 1em 0;
    }

    section > header, .miniheader {
        color: var(--section-header-light);
    }

    #ancestry {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 1em;
    }
</style>

<div id="main">
    {#if selectedId != null}
        {#await loadBird(selectedId)}
            <Loading/>
        {:then bird}
            <BirdName {bird} {editable}/>
            <div>
                <span class="miniheader">Born: </span>
                <span>{bird.date_of_birth ? bird.date_of_birth : "unknown"}</span>
            {#if bird.date_of_death}
                <div>
                    <span class="miniheader">Died: </span>
                    <span>{bird.date_of_death}</span>
                </div>
            {/if}
            </div>
            <div>
                <span class="miniheader">Sex: </span>
                <span>{bird.male != null ? bird.male ? "Male" : "Female" : "Unknown"}</span>
            </div>
            <section>
                <header>Ancestry</header>
                <div id="ancestry">
                    {#if bird.father_id == null && bird.mother_id == null}
                        <p>Unknown</p>
                    {/if}
                    <BirdPeek id={bird.father_id} recursion_level={parent_depth - 1}/>
                    <BirdPeek id={bird.mother_id} recursion_level={parent_depth - 1}/>
                </div>
            </section>
        {:catch error}
            <p>Error: {error.message}</p>
        {/await}
    {:else}
        <p id="unselected">Select a Bird</p>
    {/if}
</div>
