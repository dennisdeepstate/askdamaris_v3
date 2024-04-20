import { create_session, get_user, hash_password } from '$lib/server/auth'
import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'

export async function load({ request }) {}

export const actions = {
	default: async ({ cookies, request }) => {
		const form_data = await request.formData()
		const email = form_data.get('email')?.toString()
		const password = form_data.get('password')?.toString()
		if (!email || !password) {
			return fail(400)
		}

		const hashed_password = await hash_password(password)
		let session: { id: string }[] = []

		await db.transaction(async (tx) => {
			const user = await get_user({ email, hashed_password, tx })
			if (user.length) {
				session = await create_session({
					cookies,
					ip: request.headers.get('x-forwaded-for'),
					tx,
					user_agent: request.headers.get('user-agent'),
					user_id: user[0].user_id
				})
			}
		})
		if (session.length) {
			redirect(307, '/')
		} else {
			return fail(400)
		}
	}
}
