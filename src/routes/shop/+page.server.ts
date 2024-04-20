import db from '$lib/server/db'
import { get_shop_items } from '$lib/server/shop'

const shop_items = await db.transaction(async (tx) => await get_shop_items({ tx }))

export function load() {
	return {
		shop_items
	}
}
