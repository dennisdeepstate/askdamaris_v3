import { create_blog, get_blog_by_title } from '$lib/server/blogs.js'
import db from '$lib/server/db'
import { validate_blog_entry } from '$lib/shared/user_input_validation.js'
import { fail, redirect } from '@sveltejs/kit'
import { DrizzleError } from 'drizzle-orm'

export const actions = {
	default: async ({ request, locals }) => {
		let error = {
			message: 'An error occured on the server',
			status: 500
		}
		let new_blog_id: string | undefined = undefined
		const user_id = locals.session?.user_id

		if (!user_id) {
			redirect(307, '/auth/')
		}

		const form_data = await request.formData()
		const blog = {
			blog: form_data.get('blog')?.toString(),
			title: form_data.get('title')?.toString()
		}
		const validated_result = validate_blog_entry(blog)

		if (!validated_result.success) {
			return fail(400, { message: 'validation issues', issues: validated_result.issues })
		}

		await db.transaction(async (tx) => {
			try {
				const blogs_with_title = await get_blog_by_title({
					title: validated_result.output.title,
					tx
				})
				if (blogs_with_title.length) {
					throw new DrizzleError({
						message: 'Rollback',
						cause: 'A blog with this title already exists'
					})
				} else {
					new_blog_id = await create_blog({
						admin: user_id,
						blog: validated_result.output.blog,
						title: validated_result.output.title,
						tx
					})
				}
			} catch (e) {
				console.log(e)
				if (e instanceof DrizzleError) {
					error = {
						message: String(e.cause),
						status: 400
					}
				}
			}
		})

		if (new_blog_id) {
			return {
				new_blog_id
			}
		}

		return fail(error.status, { message: error.message })
	}
}
