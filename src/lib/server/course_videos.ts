import { avg, eq, inArray, isNotNull, type ExtractTablesWithRelations } from 'drizzle-orm'
import {
	comments_table,
	courses_table,
	users_table,
	video_ratings_table,
	videos_table
} from '$lib/server/schema'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_course_videos({
	course_ids,
	tx
}: {
	course_ids?: string[]
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
			video_title: videos_table.title,
			video_thumb: videos_table.thumb
		})
		.from(courses_table)
		.leftJoin(videos_table, eq(videos_table.course_id, courses_table.id))
		.leftJoin(video_ratings_table, eq(video_ratings_table.video_id, videos_table.id))
		.where(where_clause)
	let video_ratings
	let video_comments
	const video_ids: number[] = course_videos
		.filter((video) => video.video_id !== null)
		.map((video) => video.video_id) as number[]
	if (course_videos.length && video_ids.length) {
		video_comments = await tx
			.select({
				video_id: comments_table.video_id,
				comment: comments_table.comment,
				comment_author_id: users_table.id,
				comment_author_first_name: users_table.first_name,
				comment_author_last_name: users_table.last_name
			})
			.from(comments_table)
			.leftJoin(users_table, eq(users_table.id, comments_table.user_id))
			.where(inArray(comments_table.video_id, video_ids))
		video_ratings = await tx
			.select({
				video_id: video_ratings_table.video_id,
				video_rating: avg(video_ratings_table.rating)
			})
			.from(video_ratings_table)
			.where(inArray(video_ratings_table.video_id, video_ids))
	}
	return {
		course_videos,
		video_comments,
		video_ratings
	}
}

export { get_course_videos }
