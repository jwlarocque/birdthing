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

// abbreviated version of Bird for family tree construction
export type FamilyBird = {
    id: number;
    band_num?: string;
    depth: number;
    father_id?: number | null;
    mother_id?: number | null;
    nick?: string;
}

export type TreeNode = {
    id: number;
    item?: any;
    parents: TreeNode[];
    children: TreeNode[];
}

export async function loadBird(id:number): Promise<Bird | null> {
    let {data: bird, error} = await supabase.from("bird").select("*").eq("id", id);
    if (error) {
        console.error(error);
        return null;
    }
    return bird && bird.length ? bird[0] as Bird : null;
}

function constructTree(root:FamilyBird, birds:FamilyBird[]):TreeNode {
    let node:TreeNode = {id: root.id, item: root, parents: [], children: []};
    let remaining = birds.filter((bird:FamilyBird) => bird.id != root.id);
    // parents
    for (let bird of birds) {
        if (bird.depth == root.depth + 1) {
            if (root.father_id == bird.id || root.mother_id == bird.id) {
                node.parents.push(constructTree(bird, remaining));
            } else if (root.id == bird.father_id || root.id == bird.mother_id) {
                node.children.push(constructTree(bird, remaining));
            }
        }
    }
    return node;
}

// TODO: remove debug
export async function loadFamily(
    id:number,
    up:number=2 // generations up/ancestors
): Promise<TreeNode | null> {
    let ancestors_query = supabase.rpc("ancestors", {id: id, depth: up});
    let {data: ancestors, error: ancestors_error} = await ancestors_query;
    if (ancestors_error) {
        console.error(ancestors_error);
    }
    console.log("ancestors");
    console.log(ancestors)
    let children_query = supabase.rpc("children", {id: id});
    let {data: children, error: children_error} = await children_query;
    if (children_error) {
        console.error(children_error);
    }
    console.log("children");
    console.log(children);
    let data = ancestors.concat(children);
    let thisBird = data.find((bird:FamilyBird) => bird.id == id);
    let tree = constructTree(thisBird, data as FamilyBird[]);
    console.log(tree);
    return tree;
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
