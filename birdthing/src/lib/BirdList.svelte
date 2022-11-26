<script lang="ts">
    import Grid from "gridjs-svelte";
    import h from "gridjs-svelte";
    import { RowSelection } from "gridjs/plugins/selection";
    import "./BirdList.css";

    export let birds:Array<Object>;
    export let selectedId:Number|null = null;

    function handleRowClick(e: CustomEvent<any>) {
        // TODO: this is an (officially sanctioned) horrible hack
        selectedId = e.detail[1]._cells[0].data;
    }

    let grid_cols = [
        {
            id: "id",
            name: "ID",
            hidden: true
        },
        {
            id: "band_num",
            name: "Band Number",
            hidden: false
        },
        {
            id: "nick",
            name: "Nickname",
            hidden: false
        },
        {
            id: "male",
            name: "Sex",
            hidden: false,
            formatter: (male) => {
                if (male == null) return "";
                return male ? "Male" : "Female";
            }
        },
        {
            id: "date_of_birth",
            name: "Date of Birth",
            hidden: false
        },
    ];
    
</script>

<div id="main">
    <!-- <div id="controls">
    </div> -->
    {#if birds}
        <Grid data={birds} columns={grid_cols} sort={true} on:rowClick={handleRowClick}/>
    {:else}
        <p>Loading...</p>
    {/if}
</div>

<style>
    #main {
        display: flex;
        max-width: 100%;
    }

    #controls > p {
        background-color: white;
        padding: 0;
        margin: 0;
    }
</style>