import { Pool } from 'pg';
import { Request, Response } from '@sveltejs/kit'
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';

export function sqlizeFilters(filters:Array<string>):string {
    return ""
}

export class DB {
    ready:boolean
    pool:Pool

    constructor() {
        this.ready = false;
    }

    init() {
        this.pool = new Pool({
            database: "birdthing",
            user: "postgres",
            password: "Joebob123"
        })
    }

    query(text:string, params:Array<any>) {
        return this.pool.query(text, params)
    }

    async getRow(text:string, params:Array<any>):Promise<Object | Error> {
        let rows;

        try {
            const response = await this.query(text, params);
            rows = await response.rows;
        } catch (err) {
            console.log(err);
            
            return err;
        }

        if (!rows || rows.length == 0) {
            return new Error("Record not found");
        }

        if (rows.length > 1) {
            return new Error("Too many records found");
        }
        
        return rows[0];
    }

    async getRows(text:string, params:Array<any>):Promise<Array<Object> | Error> {
        let rows;

        try {
            const response = await this.query(text, params);
            rows = await response.rows;
        } catch (err) {
            return err;
        }

        return rows;
    }

    async GetBird(band_num:string):Promise<Object | Error> {
        return this.getRow("SELECT * FROM bird WHERE band_num = $1", [band_num]);
    }

    async GetBirds(params: QueryParams):Promise<Error | Array<Object>> {
        let query = buildQuery(`
                SELECT
                    *
                FROM bird
            `,
            params);        

        let birds = await db.getRows(query.text, query.values);	
    
        return birds;
    }
}

type Query = {
    text: string;
    values: Array<string>;
}

enum FilterType {
    Exact,
    RangeFrom,
    RangeThrough,
    Exists
}

type Filter = {
    name: string;
    type: FilterType;
    dbName?: string;
    value?: any;
};

type QueryParams = {
    filters: Array<Filter>;
    limit: string;
    offset: string;
}

export const BIRDS_FILTERS = [
    {
        name: "owner_id",
        type: FilterType.Exact
    }, {
        name: "clutch_id",
        type: FilterType.Exact
    }, {
        name: "male",
        type: FilterType.Exact
    }
];

export function ReadReqParams(filterList:Array<Filter>, req:Request):QueryParams {
    let params = {
        filters: new Array<Filter>(),
        limit: "50",
        offset: "0"
    };

    if (!req.query) {
        return params;
    }

    for (let i = 0; i < filterList.length; i++) {
        if ((req.query as ReadOnlyFormData).has(filterList[i].name)) {
            params.filters.push({
                name: filterList[i].name,
                type: filterList[i].type,
                dbName: filterList[i].dbName,
                value: (req.query as ReadOnlyFormData).get(filterList[i].name)
            });
        }
    }

    if ((req.query as ReadOnlyFormData).has("limit")) {
        params.limit = (req.query as ReadOnlyFormData).get("limit")
    }
    if ((req.query).has("offset")) {
        params.limit = (req.query as ReadOnlyFormData).get("offset")
    }

    return params;
}

function buildQuery(base_query:string, params:QueryParams):Query {
    let query_text = base_query;
    let values = new Array<string>();

    query_text += "WHERE true";

    for (let i = 0; i < params.filters.length; i++) {
        query_text += " AND " + (params.filters[i].dbName || params.filters[i].name) + " "; // TODO: change to new nullish coalesce?

        if (params.filters[i].type == FilterType.Exists) {
            query_text += "IS NOT NULL";
        } else {
            // TODO: this if/else is weird, can we do something more elegant with the enum?
            if (params.filters[i].type == FilterType.Exact) {
                query_text += "="
            } else if (params.filters[i].type == FilterType.RangeFrom) {
                query_text += ">="
            } else if (params.filters[i].type == FilterType.RangeThrough) {
                query_text += "<="
            }
            values.push(params.filters[i].value);
            query_text += " $" + String(i + 1)
        }	
    }

    return {
        text: query_text,
        values: values
    };
}

export let db:DB = new DB();