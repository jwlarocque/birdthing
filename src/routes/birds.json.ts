import type { Request, Response } from '@sveltejs/kit'

import { db, ReadReqParams, BIRDS_FILTERS } from "$lib/db"

export async function get(req:Request):Promise<Response> {
	let params = ReadReqParams(BIRDS_FILTERS, req);
	let birds = await db.GetBirds(params);
	if (birds instanceof Error) {
		return {
			status: 400,
			body: {error: birds.toString()}
		}; // TODO: better errors
	}
	return {body: birds};
}