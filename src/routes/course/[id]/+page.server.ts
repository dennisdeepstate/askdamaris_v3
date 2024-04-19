import { get_course_videos } from '$lib/server/course_videos'
import db from '$lib/server/db'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const course_id = params.id
	const course_videos = await db.transaction(
		async (tx) => await get_course_videos({ course_ids: [course_id], tx })
	)
	if (course_videos.course_videos.length < 1) {
		error(404)
	}
	return {
		course_videos
	}
}
