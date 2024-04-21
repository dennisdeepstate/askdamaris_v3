import { create_session, get_user_by_email_and_password, hash_password } from '$lib/server/auth'
import db from '$lib/server/db'
import { validate_sign_in } from '$lib/shared/user_input_validation.js'
import { fail, redirect } from '@sveltejs/kit'

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
		const hashed_password = await hash_password(validated_input.output.password)
		let session: { id: string }[] = []

		await db.transaction(async (tx) => {
			try {
				const user = await get_user_by_email_and_password({
					email: validated_input.output.email,
					hashed_password,
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
					throw new Error('the email and password combination does not exist')
				}
			} catch (e) {
				tx.rollback()
				if (e instanceof Error) {
					return fail(400, { message: e })
				} else {
					return fail(400, { message: 'An Error occured on the server' })
				}
			}
		})
		if (session.length) {
			redirect(307, '/')
		} else {
			return fail(400)
		}
	}
}
