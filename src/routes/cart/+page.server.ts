import { get_cart_items } from '$lib/server/cart'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
	const user_id = locals.session?.id
	if (!user_id) {
		error(403)
	}
	const cart_items = await db.transaction(async (tx) => await get_cart_items({ tx, user_id }))
	return {
		cart_items
	}
}
