import type { Request, Response } from '@sveltejs/kit'

import { db } from "$lib/db"


export async function get({ params }:Request):Promise<Response> {
	const { slug } = params;
	
	let bird = await db.GetBird(slug);
	
	if (bird instanceof Error) {
		return {
			status: 400,
			body: {error: bird.toString()}
		};  // TODO: better errors
	}
	return {
		body: await bird
	}
}