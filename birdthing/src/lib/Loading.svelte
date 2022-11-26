<script lang="ts">
    import {BarLoader} from 'svelte-loading-spinners';
</script>

<style>
    #wrapper {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
</style>

<div id="wrapper">
    <BarLoader size=3 unit="em" color="#ee4035"/>
</div>