<script lang="ts">
    import { loadBird } from "./bird";
	import BirdName from "./BirdName.svelte";
    import Loading from "./Loading.svelte";

    export let id:number;
    // TODO: recursion
    export let recursion_level:number;

    function lifetimeString(dob:string, dod:string) {
        let out = dob ? new Date(dob).getFullYear().toString() : "unknown"
        out += " - "
        out += dod ? new Date(dod).getFullYear() : ""
        return out
    }
</script>

<style>
    .bird {
        flex: 1 1 0;
        border: 1px solid var(--section-header-light);
        border-radius: var(--main-radius);
        box-shadow: var(--main-shadow);
    }
    .bird.male {
        border-color: var(--male-light);
    }
    .bird.female {
        border-color: var(--female-light);
    }
    
    .bird > * {
        margin: 1em;
    }

    #parents {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }
</style>

{#await loadBird(id)}
    <Loading/>
{:then bird}
    {#if bird != null}
        <div class={bird.male ? "bird male" : "bird female"}>
            <BirdName {bird}/>
            <p>{lifetimeString(bird.date_of_birth, bird.date_of_death)}</p>
            {#if recursion_level > 0}
                <div id="parents">
                    <svelte:self id={bird.father_id} recursion_level={recursion_level - 1}/>
                    <svelte:self id={bird.mother_id} recursion_level={recursion_level - 1}/>
                </div>
            {/if}
        </div>
    {/if}
{:catch error}
    <div class="bird">
        <p>Error: {error.message}</p>
    </div>
{/await}
