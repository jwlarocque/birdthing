// import { supabase } from "$lib/supabase";
import PocketBase from 'pocketbase';

export const pb = new PocketBase;

const TEXT_SEARCH_PROPS = ["band_num", "nick"];
const DATE_PROPS = ["date_of_birth", "date_of_death"]
const PARENT_PROPS = ["mother", "father"]
const DEFAULT_COUNT = 10;

export type Bird = {
    // [key: string]: number | string | boolean | Date | null | undefined;
    id: string;
    band_num?: string;
    owner?: string;
    male?: boolean;
    date_of_birth?: Date;
    date_of_death?: Date;
    nick?: string;
    notes?: string;
    // father_id?: string | null;
    // mother_id?: string | null;
    father?: Bird | null;
    mother?: Bird | null;
    children?: Bird[] | null;
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
    id: string;
    item?: any;
    parents: TreeNode[];
    children: TreeNode[];
}

export async function loadBird(id:string): Promise<Bird | null> {
    try {
        let data = await pb.collection('bird').getOne(id, {"expand": "mother,father,mother.mother,mother.father,father.mother,father.father,bird(mother),bird(father)"});
        data.mother = data?.expand?.mother;
        data.father = data?.expand?.father;
        return data as Bird;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// function constructTree(root:FamilyBird, birds:FamilyBird[]):TreeNode {
//     let node:TreeNode = {id: root.id, item: root, parents: [], children: []};
//     let remaining = birds.filter((bird:FamilyBird) => bird.id != root.id);
//     // parents
//     for (let bird of birds) {
//         if (bird.depth == root.depth + 1) {
//             if (root.father_id == bird.id || root.mother_id == bird.id) {
//                 node.parents.push(constructTree(bird, remaining));
//             } else if (root.id == bird.father_id || root.id == bird.mother_id) {
//                 node.children.push(constructTree(bird, remaining));
//             }
//         }
//     }
//     return node;
// }

export function constructFamily(birdData:any):TreeNode {
    let parents:TreeNode[] = [];
    if (birdData?.expand?.father) { parents.push(constructFamily(birdData.expand.father)); }
    if (birdData?.expand?.mother) { parents.push(constructFamily(birdData.expand.mother)); }
    let children:TreeNode[] = [];
    if (birdData?.expand && Object.hasOwn(birdData.expand, "bird(mother)")) {
        children = children.concat(birdData.expand["bird(mother)"].map((childData:any) => constructFamily(childData)));
    }
    if (birdData?.expand && Object.hasOwn(birdData.expand, "bird(father)")) {
        children = children.concat(birdData.expand["bird(father)"].map((childData:any) => constructFamily(childData)));
    }
    return {
        id: birdData.id,
        item: birdData as Bird,
        parents: parents,
        children: children
    };
}

// TODO: consider pagination (not needed for now)
export async function searchBirds(args:any, autocancel=true): Promise<Bird[]> {
    let filter = "1=1"
    for (const property in args) {
        // TODO: function lookup instead of all these conditionals
        // TODO: OR with search on nickname
        // TODO: investigate SQL injection lol
        // TODO: this is ridiculous
        let value = args[property];
        if (TEXT_SEARCH_PROPS.includes(property) || DATE_PROPS.includes(property) || property == "id" || property == "!id") {
            value = "\"" + args[property] + "\"";
        }
        if (TEXT_SEARCH_PROPS.includes(property)) {
            filter += ` && ${property} ~ ${value}`;
        } else if (property[0] === "!") {
            filter += ` && ${property.slice(1)} != ${value}`;
        } else {
            filter += ` && ${property} = ${value}`;
        }
    }
    let requestParams:any = {
        perPage: args.count ?? 30,
        filter: filter
    }
    if (autocancel == false) {
        requestParams["requestKey"] = null;
    }
    const records = await pb.collection("bird").getFullList(requestParams);
    return records;
}

// cleans Bird object for insertion into DB
// for example, Dates === "" => undefined
function cleanBird(bird:Bird): any {
    let result = structuredClone(bird) as any;
    result.owner = pb.authStore.model?.id;
    for (const [key, value] of Object.entries(result)) {
        if (DATE_PROPS.includes(key) && value === "") {
            result[key] = null as any;
        } else if (PARENT_PROPS.includes(key) && value) {
            result[key] = (value as Bird)["id"]; // TODO: typescript mess
        }
    }
    return result;
}

export async function postBird(bird:Bird) {
    let cleaned = cleanBird(bird);
    const record = await pb.collection("bird").create(cleaned);
    // TODO: display/return errors
}

export async function updateBird(bird:Bird):Promise<Bird> {
    const data = cleanBird(bird);
    const record = await pb.collection("bird").update(bird.id, data);
    return record;
}

export async function deleteBird(id:string) {
    const response = await pb.collection('bird').delete(id);
    // TODO: display/return errors
}
