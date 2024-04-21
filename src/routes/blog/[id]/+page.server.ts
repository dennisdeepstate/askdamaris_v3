import { get_blogs } from '$lib/server/blogs'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const blog_id = params.id
	const blogs = await db.transaction(async (tx) => await get_blogs({ blog_ids: [blog_id], tx }))
	if (blogs.blogs.length < 1) {
		error(404)
	}
	return blogs
}
