import { get_course_videos } from '$lib/server/course_videos'
import db from '$lib/server/db'

const course_videos = await db.transaction(async (tx) => await get_course_videos({ tx }))

export function load() {
	return {
		course_videos
	}
}
