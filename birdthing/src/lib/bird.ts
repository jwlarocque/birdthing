export type Bird = {
    id: number;
    band_num?: string;
    owner_id?: number;
    male?: boolean;
    date_of_birth?: string;
    date_of_death?: string;
    nick?: string;
    notes?: string;
    father_id?: number;
    mother_id?: number;
}

export async function loadBird(id:number): Promise<Bird | null> {
    if (id == null) {
        return null;
    }
    const res = await fetch(`/api/birds/${id}`);
    const json = await res.json();
    if (res.ok) {
        return json;
    } else {
        throw new Error(json.detail);
    }
}

// band_num?:string,
// dob_from?:string,
// dob_to?:string,
// dod_from?:string,
// dod_to?:string,
// father_id?:number,
// mother_id?:number,
// male?:boolean,
// nick?:string,
// owner_id?:number

export async function searchBirds(args:object): Promise<Bird[] | null> {
    let url_params = ""
    if (args.band_num) {
        url_params += `band_num=${args.band_num}&`;
    }
    if (args.male != null) {
        url_params += `male=${args.male}&`;
    }
    const res = await fetch(`api/birds?` + url_params)
    const json = await res.json();
    if (res.ok) {
        return json.birds;
    } else {
        throw new Error(json.detail);
    }
}

export async function postBird(bird:Bird): Promise<object | null> {
    if (bird.date_of_death != null && !bird.date_of_death) {
        bird.date_of_death = undefined;
    }
    if (bird.date_of_birth != null && !bird.date_of_birth) {
        bird.date_of_birth = undefined;
    }
    const res = await fetch(
        `api/birds`,
        {
            method: "Post",
            headers: {
                "Content-Type": "applicaton/json"},
            body: JSON.stringify(bird)});
    const json = await res.json();
    if (res.ok) {
        return json;
    } else {
        throw new Error(json.detail);
    }
}
