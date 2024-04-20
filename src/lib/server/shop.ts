import { inArray, isNotNull, type ExtractTablesWithRelations } from 'drizzle-orm'
import { shop_items_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_shop_items({
	item_ids,
	tx
}: {
	item_ids?: number[]
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const where_clause = item_ids
		? inArray(shop_items_table.id, item_ids)
		: isNotNull(shop_items_table.id)
	const items = await tx
		.select({
			item_id: shop_items_table.id,
			category: shop_items_table.category,
			description: shop_items_table.description,
			price: shop_items_table.price,
			max: shop_items_table.max_order_qty,
			min: shop_items_table.min_order_qty,
			qty_at_hand: shop_items_table.qty_at_hand,
			thumb: shop_items_table.thumb,
			title: shop_items_table.title
		})
		.from(shop_items_table)
		.where(where_clause)

	return {
		items
	}
}

export { get_shop_items }
