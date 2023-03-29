<script>
    import Model from 'svelte-simple-modal';
    import {createForm} from 'felte';
    import Select from 'svelte-select';
    import { searchBirds, postBird } from "./bird";
	import BirdName from './BirdName.svelte';
    import SelectBirdName from './SelectBirdName.svelte';


    const {form, data} = createForm({
        onSubmit: async (values) => {
            postBird(values);
        },
    });

    function handleParentSelection(event, field) {
        $data[field] = event.detail.id;
    }

    function searchBirdsSex(male) {
        return function search(options) {
            console.log(options);
            return searchBirds({"band_num": options, "male": male});
        }
    }

    let itemFilter = (label, filterText, option) => true;
</script>

<style>
    #main {
        background-color: white;
        box-shadow: var(--main-shadow);
        border-radius: var(--main-radius);
        display: flex;
        flex-direction: column;
    }

    #main > * {
        margin: 1em;
    }

    h3 {
        margin: 0;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: calc(100% - 2em);
    }

    .soft-row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
        width: 100%;
    }

    .soft-row > * {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
    }

    .radio-group > div {
        margin-left: 2em;
    }

    label {
        margin-right: 0.5em;
    }

    button, input {
        border-radius: var(--field-radius);
        border: 1px solid var(--field-border-light);
        font-family: "Merriweather", "Arial";
    }

    button {
        font-size: 1em;
        padding: 0.6em 1.2em;
        box-sizing: border-box;
        width: fit-content;
        border: none;
    }

    input:not([type="radio"]) {
        padding: 0.6em;
        width: 100%;
        box-sizing: border-box;
    }

    input:focus {
        border-color: var(--emph-light);
        outline: none;
    }

    :global(.parent-select input::-webkit-input-placeholder) {
        font-family: "Merriweather", Arial, sans-serif;
    }

    :global(.parent-select input::-moz-placeholder) {
        font-family: "Merriweather", Arial, sans-serif;
    }

    :global(.parent-select input:-moz-placeholder) {
        font-family: "Merriweather", Arial, sans-serif;
    }

    :global(.parent-select input:-ms-input-placeholder) {
        font-family: "Merriweather", Arial, sans-serif;
    }

    div.parent-select {
        font-family: "Merriweather" !important;
        --spinnerColor: var(--emph-light);
        --borderFocusColor: var(--emph-light);
        flex: 1 1 0;
    }
</style>

<div id="main">
    <form use:form>
        <h3>New Bird</h3>
        <div class="soft-row">
            <div>
                <label for="band_num">Band Number</label>
                <input type="text" name="band_num" required/>
            </div>
            <div>
                <label for="nick">Nickname</label>
                <input type="text" name="nick"/>
            </div>
        </div>
        <div class="soft-row">
            <div>
                <label for="date_of_birth">Date of Birth</label>
                <input type="date" name="date_of_birth"/>
            </div>
            <div>
                <label for="date_of_death">Date of Death</label>
                <input type="date" name="date_of_death"/>
            </div>
        </div>
        <div class="radio-group">
            <span>Sex</span>
            <div>
                <input type="radio" name="male" value="true" required/>
                <label for="male">Male</label>
            </div>
            <div>
                <input type="radio" name="male" value="false" required/>
                <label for="female">Female</label>
            </div>
        </div>
        <div class="soft-row">
            <div class="parent-select">
                <span>Father</span>
                <!-- TODO: upgrade to v5 -->
                <Select
                    loadOptions={searchBirdsSex(true)}
                    itemFilter={itemFilter}
                    optionIdentifier={"id"}
                    getSelectionLabel={(option) => option.band_num}
                    getOptionLabel={(option) => option.band_num}
                    Item={SelectBirdName}
                    on:select={(event) => handleParentSelection(event, "father_id")}
                ></Select>
            </div>
            <div class="parent-select">
                <span>Mother</span>
                <Select
                    loadOptions={searchBirdsSex(false)}
                    itemFilter={itemFilter}
                    optionIdentifier={"id"}
                    getSelectionLabel={(option) => option.band_num}
                    getOptionLabel={(option) => option.band_num + (option.nick ? " " + option.nick : "!")}
                    Item={SelectBirdName}
                    on:select={(event) => handleParentSelection(event, "mother_id")}
                ></Select>
            </div>
        </div>
        <button type="submit">Create</button>
    </form>
</div>
