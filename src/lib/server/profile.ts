import { eq, type ExtractTablesWithRelations } from 'drizzle-orm'
import { courses_table, shop_items_table, user_purchases_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_user_purchases({
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
	const courses = await tx
		.select({
			pucrhase_id: user_purchases_table.id,
			course_id: user_purchases_table.course_id,
			course_thumb: courses_table.thumb,
			course_title: courses_table.title,
			qty: user_purchases_table.qty,
			rate: user_purchases_table.rate
		})
		.from(user_purchases_table)
		.leftJoin(courses_table, eq(courses_table.id, user_purchases_table.course_id))
		.where(eq(user_purchases_table.user_id, user_id))
	const items = await tx
		.select({
			pucrhase_id: user_purchases_table.id,
			shop_item_id: user_purchases_table.shop_item_id,
			item_thumb: shop_items_table.thumb,
			item_title: shop_items_table.title,
			qty: user_purchases_table.qty,
			rate: user_purchases_table.rate
		})
		.from(user_purchases_table)
		.leftJoin(shop_items_table, eq(shop_items_table.id, user_purchases_table.shop_item_id))
		.where(eq(user_purchases_table.user_id, user_id))

	return {
		courses,
		items
	}
}

export { get_user_purchases }
