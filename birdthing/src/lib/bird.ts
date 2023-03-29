import { supabase } from "$lib/supabase";

const TEXT_SEARCH_PROPS = ["band_num", "nick"];
const DATE_PROPS = ["date_of_birth", "date_of_death"]
const DEFAULT_COUNT = 10;

export type Bird = {
    [key: string]: number | string | boolean | undefined;
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
    let {data: bird, error} = await supabase.from("bird").select("*").eq("id", id);
    if (error) {
        console.error(error);
        return null;
    }
    return bird && bird.length ? bird[0] as Bird : null;
}

export async function searchBirds(args:any): Promise<Bird[] | null> {
    console.log(args); // TODO: remove debug
    // defaults
    if (!Object.hasOwn(args, "count")) {
        args["count"] = DEFAULT_COUNT
    }

    let query = supabase.from("bird").select("*")
    for (const property in args) {
        // TODO: function lookup instead of all these conditionals
        // TODO: OR with search on nickname
        if (TEXT_SEARCH_PROPS.includes(property)) {
            query = query.ilike(property, "%" + args[property] + "%");
        } else if (property === "count") {
            query = query.limit(args["count"])
        } else {
            query = query.eq(property, args[property]);
        }
    }
    console.log(query);
    let {data: birds, error} = await query;
    if (error) {
        console.error(error);
        return null;
    }
    return birds as Bird[];
}

export async function postBird(bird:Bird) {
    for (const date_prop of DATE_PROPS) {
        if (Object.hasOwn(bird, date_prop) && bird[date_prop] === "") {
            delete bird[date_prop];
        }
    }
    let query = supabase.from("bird").insert([bird]);
    const {data, error} = await query;
    if (error) {
        console.error(error);
    }
    // TODO: update application birds after a new one is created
}
