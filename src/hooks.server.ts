import { get_session } from '$lib/server/auth'
import db from '$lib/server/db'
import { redirect } from '@sveltejs/kit'

const protected_paths = ['/profile', '/cart']

export async function handle({ event, resolve }) {
	let session = undefined
	await db.transaction(async (tx) => {
		session = await get_session({ cookies: event.cookies, tx })
		if (protected_paths.some((path) => event.url.pathname.startsWith(path)) && !session) {
			redirect(307, '/auth/')
		}
		if (event.url.pathname.startsWith('/auth') && session) {
			redirect(307, '/')
		}
	})

	event.locals.session = session

	const response = await resolve(event)
	return response
}
