import { create_user, hash_password } from '$lib/server/auth'
import db from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'

export async function load({ request }) {}
export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData()
		const email = form_data.get('email')?.toString()
		const password = form_data.get('password')?.toString()
		const first_name = form_data.get('first_name')?.toString()
		const last_name = form_data.get('last_name')?.toString()

		if (!email || !password || !first_name || !last_name) {
			return fail(400)
		}

		const hashed_password = await hash_password(password)

		const new_user = await db.transaction(async (tx) =>
			create_user({ email, hashed_password, first_name, last_name, tx })
		)
		if (new_user.length < 1) {
			return fail(400)
		} else {
			redirect(307, '/')
		}
	}
}
