import { get_course_videos } from '$lib/server/course_videos'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

const course_videos = await db.transaction(async (tx) => await get_course_videos({ tx }))

export function load() {
	if (course_videos.length < 1) {
		error(404)
	}
	return {
		course_videos
	}
}
