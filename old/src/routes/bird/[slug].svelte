<script context="module">
    let birdData;

    export async function load({ page, fetch, session, context }) {
		const url = `/bird/${page.params.slug}.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					birdData: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}

</script>

<script>
    export let birdData;

    $: console.log(birdData);
</script>


<svelte:head>
    <title>Bird {birdData["band_num"] ? birdData["band_num"] : "Loading..."}</title>
</svelte:head>

<p>{birdData ? JSON.stringify(birdData) : "..."}</p>