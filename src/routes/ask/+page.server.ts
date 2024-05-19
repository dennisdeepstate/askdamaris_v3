import { add_context, ask_open_ai, system_message } from '$lib/server/ask.js'
import db from '$lib/server/db'
import { fail } from '@sveltejs/kit'

export const actions = {
	default: async ({ request }) => {
		const form_data = await request.formData()
		const roles = form_data.getAll('role[]')
		const content = form_data.getAll('message[]')

		if (
			roles.length < 2 ||
			roles.length !== content.length ||
			roles.some((role) => role !== 'user' && role !== 'assistant')
		) {
			return fail(400, { message: 'wrong format' })
		}

		const conversations = roles.map((role, i) => ({
			role: role?.toString(),
			content: content[i]?.toString()
		}))

		conversations.unshift(system_message)
		const message = conversations.pop()?.content
		if (!message) {
			return fail(400, { message: 'wrong format' })
		}

		const message_with_context = await db.transaction(async (tx) => await add_context(message, tx))
		conversations.push(message_with_context)
		conversations.push({ role: 'user', content: message })

		const answer = await ask_open_ai(conversations)

		return {
			answer,
			message_with_context: message_with_context.content
		}
	}
}
