import { get_blogs } from '$lib/server/blogs'
import db from '$lib/server/db'

const blogs = await db.transaction(async (tx) => await get_blogs({ tx }))

export function load() {
	return blogs
}
