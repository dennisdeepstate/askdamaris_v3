import { desc, eq, inArray, isNotNull, type ExtractTablesWithRelations, sum } from 'drizzle-orm'
import { blog_likes_table, blogs_table, comments_table, users_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
import { alphabet, generateRandomString } from 'oslo/crypto'

async function get_blogs({
	blog_ids,
	limit = 100,
	offset = 0,
	tx
}: {
	blog_ids?: string[]
	limit?: number
	offset?: number
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
			blog: blogs_table.blog_markdown,
			created_at: blogs_table.created_at,
			tags: blogs_table.tags,
			thumb: blogs_table.thumb,
			title: blogs_table.title
		})
		.from(blogs_table)
		.leftJoin(users_table, eq(users_table.id, blogs_table.author_id))
		.where(where_clause)
		.orderBy(desc(blogs_table.created_at))
		.limit(limit)
		.offset(offset)

	let blog_likes
	let blog_comments
	if (blogs.length) {
		blog_comments = await tx
			.select({
				blog_id: comments_table.blog_id,
				comment: comments_table.comment,
				comment_author_id: comments_table.user_id,
				comment_author_first_name: users_table.first_name,
				comment_author_last_name: users_table.last_name
			})
			.from(blogs_table)
			.leftJoin(comments_table, eq(comments_table.blog_id, blogs_table.id))
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

async function get_blog_by_title({
	title,
	tx
}: {
	title: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	return await tx
		.select({ id: blogs_table.id })
		.from(blogs_table)
		.where(eq(blogs_table.title, title))
}

async function create_blog({
	admin,
	blog,
	title,
	tx
}: {
	admin: string
	blog: string
	title: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const blog_id = generateRandomString(12, alphabet('a-z', '0-9')).concat(title)
	await tx.insert(blogs_table).values({
		id: blog_id,
		author_id: admin,
		created_at: new Date(),
		blog_markdown: blog,
		title: title,
		thumb: ''
	})
	return blog_id
}

export { create_blog, get_blogs, get_blog_by_title }
