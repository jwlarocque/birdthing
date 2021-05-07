import type { Request, Response } from '@sveltejs/kit'

import { db } from "$lib/db";

export async function handle(params:any) {
    if (!db.ready) {
        await db.init();
    }
    
    return params.render(params.request);
}