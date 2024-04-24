import { create_user, get_user_by_email, hash_password } from '$lib/server/auth'
import db from '$lib/server/db'
import { validate_sign_up } from '$lib/shared/user_input_validation.js'
import { fail, redirect } from '@sveltejs/kit'
import { DrizzleError } from 'drizzle-orm'

export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData()
		const email = form_data.get('email')?.toString()
		const password = form_data.get('password')?.toString()
		const first_name = form_data.get('first_name')?.toString()
		const last_name = form_data.get('last_name')?.toString()

		if (!email || !password || !first_name || !last_name) {
			return fail(400, { message: 'Please fill all the fields' })
		}
		const validated_input = validate_sign_up({ email, password, first_name, last_name })
		if (!validated_input.success) {
			return fail(400, { message: 'Please provide valid inputs', issues: validated_input.issues })
		}

		let new_user: { id: string }[] = []
		let error: { message: string | undefined; status: number } = {
			message: 'An error occured on the server',
			status: 500
		}
		const hashed_password = await hash_password(validated_input.output.password)
		await db.transaction(async (tx) => {
			try {
				if ((await get_user_by_email({ email: validated_input.output.email, tx })).length) {
					throw new DrizzleError({
						message: 'Rollback',
						cause: 'The email provided is already registered'
					})
				}
				new_user = await create_user({
					email: validated_input.output.email,
					hashed_password,
					first_name: validated_input.output.first_name,
					last_name: validated_input.output.last_name,
					tx
				})
			} catch (e) {
				if (e instanceof DrizzleError) {
					error = {
						message: String(e.cause),
						status: 400
					}
				}
			}
		})

		if (new_user?.length) {
			redirect(307, '/')
		} else {
			return fail(error.status, { message: error.message })
		}
	}
}
