import db from '$lib/server/db'
import { get_user_purchases } from '$lib/server/profile'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
	const user_id = locals.session?.user_id
	if (!user_id) {
		error(400)
	}
	let user_purchases: { items: any[]; courses: any[] } = {
		courses: [],
		items: []
	}

	await db.transaction(async (tx) => {
		user_purchases = await get_user_purchases({ user_id, tx })
	})

	return user_purchases
}
