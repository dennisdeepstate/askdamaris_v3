import db from '$lib/server/db.js'
import { delete_session } from '$lib/server/auth.js'
import { redirect } from '@sveltejs/kit'

export async function GET({ cookies }) {
	await db.transaction(async (tx) => delete_session({ cookies, tx }))
	redirect(307, '/')
}
