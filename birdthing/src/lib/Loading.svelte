<script lang="ts">
    import {BarLoader} from 'svelte-loading-spinners';
</script>

<style>
    #wrapper-col {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    #wrapper-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>

<div id="wrapper-row">
    <div id="wrapper-col">
        <BarLoader size=3 unit="em" color="#ee4035"/>
    </div>
</div>