import { create_session, verify_email_and_password_combination } from '$lib/server/auth'
import db from '$lib/server/db'
import { validate_sign_in } from '$lib/shared/user_input_validation.js'
import { fail, redirect } from '@sveltejs/kit'
import { DrizzleError } from 'drizzle-orm/errors'

export const actions = {
	default: async ({ cookies, request }) => {
		const form_data = await request.formData()
		const email = form_data.get('email')?.toString()
		const password = form_data.get('password')?.toString()

		if (!email || !password) {
			return fail(400, { message: 'Please fill all the fields' })
		}
		const validated_input = validate_sign_in({ email, password })
		if (!validated_input.success) {
			return fail(400, { message: 'Please provide valid inputs', issues: validated_input.issues })
		}
		let session: { id: string }[] = []
		let error: { message: string | undefined; status: number } = {
			message: 'An error occured on the server',
			status: 500
		}
		await db.transaction(async (tx) => {
			try {
				const user = await verify_email_and_password_combination({
					email: validated_input.output.email,
					password: validated_input.output.password,
					tx
				})
				if (user.length) {
					session = await create_session({
						cookies,
						ip: request.headers.get('x-forwaded-for'),
						tx,
						user_agent: request.headers.get('user-agent'),
						user_id: user[0].user_id
					})
				} else {
					throw new DrizzleError({
						message: 'Rollback',
						cause: 'The email and password combination provided does not exist'
					})
				}
			} catch (e) {
				if (e instanceof DrizzleError) {
					error = {
						message: String(e.cause),
						status: 400
					}
				}
			}
		})
		if (session.length) {
			redirect(307, '/')
		} else {
			return fail(error.status, { message: error.message })
		}
	}
}
