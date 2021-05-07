<script context="module">
    let birdData;

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
    export let birdData;
</script>


<svelte:head>
    <title>Bird {birdData["band_num"] ? birdData["band_num"] : "Loading..."}</title>
</svelte:head>

<p>{birdData ? JSON.stringify(birdData) : "..."}</p>