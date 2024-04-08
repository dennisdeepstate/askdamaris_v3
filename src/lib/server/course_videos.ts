import db from '$lib/server/db'
import { avg, eq, inArray, isNotNull, type ExtractTablesWithRelations } from 'drizzle-orm'
import { courses_table, video_ratings_table, videos_table } from '$lib/server/schema'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_course_videos({
	course_ids,
	tx
}: {
	course_ids?: number[]
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const where_clause = course_ids
		? inArray(courses_table.id, course_ids)
		: isNotNull(courses_table.id)
	const course_videos = await tx
		.select({
			course_id: courses_table.id,
			course_description: courses_table.description,
			course_price: courses_table.price,
			course_thumb: courses_table.thumb,
			course_title: courses_table.title,
			video_id: videos_table.id,
			video_bunny_id: videos_table.bunny_id,
			video_description: videos_table.description,
			video_is_premium: videos_table.premium,
			video_rating: avg(video_ratings_table.rating),
			video_title: videos_table.title,
			video_thumb: videos_table.thumb
		})
		.from(courses_table)
		.leftJoin(videos_table, eq(videos_table.course_id, courses_table.id))
		.leftJoin(video_ratings_table, eq(video_ratings_table.video_id, videos_table.id))
		.where(where_clause)
	return course_videos
}

export { get_course_videos }
