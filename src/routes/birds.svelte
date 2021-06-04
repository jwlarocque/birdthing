<script context="module">
    let birdData;


    $: console.log(birdData);

    export async function load({ page, fetch, session, context }) {
        const myHeaders = new Headers({
            "content-type": "application/json"
        });

        const res = await fetch(
            '/birds.json', 
            {
                headers: {
                    "content-type": "application/json"
                },
                method: "GET",
                body: page.query
            }
        );

        if (res.ok) {
            return {
                props: {
                    birdData: await res.json()
                }
            };
        }

        return {
            status: res.status,
            error: new Error(`Could not load ${JSON.stringify(page)}`)
        };
    }

</script>

<script>
    import BirdList from "$lib/components/BirdList.svelte";
    import BirdDetail from "$lib/components/BirdDetail.svelte";
    export let birdData;
    let selectedIndex;
</script>


<svelte:head>
    <title>Birds</title>
</svelte:head>

{#if birdData}
    <div class="horiz-content">
        <BirdList birds={birdData} bind:selectedIndex={selectedIndex}></BirdList>
        <BirdDetail bird={birdData[selectedIndex]}></BirdDetail>
    </div>
{:else}
    <p>...</p>
{/if}

<style>
    
</style>