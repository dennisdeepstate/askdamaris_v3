import { get_cart_items } from '$lib/server/cart'
import db from '$lib/server/db'

const user_id = ''
const cart_items = await db.transaction(async (tx) => await get_cart_items({ tx, user_id }))

export function load() {
	return {
		cart_items
	}
}
