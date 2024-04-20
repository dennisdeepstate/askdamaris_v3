import db from '$lib/server/db'
import { get_shop_items } from '$lib/server/shop.js'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const item_id = parseInt(params.id)
	if (isNaN(item_id)) {
		error(404)
	}
	const shop_items = await db.transaction(
		async (tx) => await get_shop_items({ item_ids: [item_id], tx })
	)
	if (shop_items.items.length < 1) {
		error(404)
	}
	return {
		shop_items
	}
}
