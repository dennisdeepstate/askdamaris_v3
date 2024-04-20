import { eq, type ExtractTablesWithRelations } from 'drizzle-orm'
import { cart_table, shop_items_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_cart_items({
	user_id,
	tx
}: {
	user_id: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const items = await tx
		.select({
			cart_id: cart_table.id,
			item_id: cart_table.item_id,
			category: shop_items_table.category,
			description: shop_items_table.description,
			price: shop_items_table.price,
			max: shop_items_table.max_order_qty,
			min: shop_items_table.min_order_qty,
			qty_in_stock: shop_items_table.qty_at_hand,
			qty: cart_table.qty,
			thumb: shop_items_table.thumb,
			title: shop_items_table.title
		})
		.from(cart_table)
		.leftJoin(shop_items_table, eq(shop_items_table.id, cart_table.item_id))
		.where(eq(cart_table.user_id, user_id))

	return {
		items
	}
}

export { get_cart_items }
