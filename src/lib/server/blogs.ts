import { eq, inArray, isNotNull, type ExtractTablesWithRelations, sum } from 'drizzle-orm'
import { blog_likes_table, blogs_table, comments_table, users_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

async function get_blogs({
	blog_ids,
	tx
}: {
	blog_ids?: string[]
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const where_clause = blog_ids ? inArray(blogs_table.id, blog_ids) : isNotNull(blogs_table.id)
	const blogs = await tx
		.select({
			blog_id: blogs_table.id,
			author_id: blogs_table.author_id,
			author_first_name: users_table.first_name,
			author_last_name: users_table.last_name,
			created_at: blogs_table.created_at,
			tags: blogs_table.tags,
			thumb: blogs_table.thumb,
			title: blogs_table.title
		})
		.from(blogs_table)
		.leftJoin(users_table, eq(users_table.id, blogs_table.author_id))
		.where(where_clause)

	let blog_likes
	let blog_comments
	if (blogs.length) {
		blog_comments = await tx
			.select({
				blog_id: comments_table.blog_id,
				comment: comments_table.comment,
				comment_author_id: comments_table.user_id,
				comment_author_first_name: users_table.first_name
			})
			.from(blogs_table)
			.leftJoin(users_table, eq(users_table.id, comments_table.user_id))
			.where(
				inArray(
					blogs_table.id,
					blogs.map((blog) => blog.blog_id)
				)
			)
		blog_likes = await tx
			.select({ blog_id: blog_likes_table.blog_id, likes: sum(blog_likes_table.blog_id) })
			.from(blog_likes_table)
			.where(
				inArray(
					blog_likes_table.blog_id,
					blogs.map((blog) => blog.blog_id)
				)
			)
	}
	return {
		blogs,
		blog_comments,
		blog_likes
	}
}

export { get_blogs }
