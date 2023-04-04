import { supabase } from "$lib/supabase";

const TEXT_SEARCH_PROPS = ["band_num", "nick"];
const DATE_PROPS = ["date_of_birth", "date_of_death"]
const DEFAULT_COUNT = 10;

export type Bird = {
    [key: string]: number | string | boolean | Date | null | undefined;
    id: number;
    band_num?: string;
    owner_id?: number;
    male?: boolean;
    date_of_birth?: Date;
    date_of_death?: Date;
    nick?: string;
    notes?: string;
    father_id?: number | null;
    mother_id?: number | null;
}

export async function loadBird(id:number): Promise<Bird | null> {
    let {data: bird, error} = await supabase.from("bird").select("*").eq("id", id);
    if (error) {
        console.error(error);
        return null;
    }
    return bird && bird.length ? bird[0] as Bird : null;
}

// TODO: consider pagination (not needed for now)
export async function searchBirds(args:any): Promise<Bird[]> {
    console.log(args); // TODO: remove debug
    // defaults
    if (!Object.hasOwn(args, "count")) {
        args["count"] = DEFAULT_COUNT;
    }

    let query = supabase.from("bird").select("id,band_num,male,date_of_birth,date_of_death,nick");
    for (const property in args) {
        // TODO: function lookup instead of all these conditionals
        // TODO: OR with search on nickname
        if (TEXT_SEARCH_PROPS.includes(property)) {
            query = query.ilike(property, "%" + args[property] + "%");
        } else if (property === "count") {
            query = query.limit(args["count"]);
        } else if (property[0] === "!") {
            query = query.neq(property.slice(1), args[property]);
        } else {
            query = query.eq(property, args[property]);
        }
    }
    query = query.order("updated_at", {ascending: false});
    console.log(query);
    let {data: birds, error} = await query;
    if (error) {
        console.error(error);
        return [];
    }
    return birds as Bird[];
}

// cleans Bird object for insertion into DB
// for example, Dates === "" => undefined
function cleanBird(bird:Bird) {
    let result = structuredClone(bird)
    for (const date_prop of DATE_PROPS) {
        if (Object.hasOwn(result, date_prop) && result[date_prop] === "") {
            delete result[date_prop];
        }
    }
    return result;
}

export async function postBird(bird:Bird) {
    let cleaned = cleanBird(bird);
    let query = supabase.from("bird").insert([cleaned]);
    const {data, error} = await query;
    if (error) {
        console.error(error);
    }
    // TODO: update application birds after a new one is created
}

export async function updateBird(bird:Bird):Promise<boolean> {
    let query = supabase.from("bird").update(cleanBird(bird)).eq("id", bird.id);
    const {data, error} = await query;
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}
