<script lang="ts">
	import BirdDetail from "$lib/BirdDetail.svelte";

    export let data;
</script>

<BirdDetail selectedId={data.slug} editable={true}/>