<script lang="ts">
	import Textarea from '$lib/components/textarea.svelte'
	import Button from '$lib/components/button.svelte'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'

	let conversations: {
		role: 'assistant' | 'user'
		message: string
		message_with_context: string
	}[] = [
		{
			role: 'assistant',
			message: 'ask damaris...',
			message_with_context: 'ask damaris...'
		}
	]

	let error_message: string | undefined
	let loading = false

	const ask_ai: SubmitFunction = async ({ formData, cancel }) => {
		if (loading) cancel()
		error_message = undefined
		loading = true
		let message = String(Array.from(formData.getAll('message[]')).pop()) ?? ''

		return async ({ result }) => {
			if (result.type === 'success' && result.data?.answer) {
				let message_with_context = message
				if (result.data?.message_with_context) {
					message_with_context = result.data.message_with_context
						.toString()
						.concat(`\n Question: ${message}`)
				}
				conversations.push({ role: 'user', message, message_with_context })
				conversations.push({
					role: 'assistant',
					message: result.data.answer,
					message_with_context: result.data.answer
				})
				conversations = conversations
			}
			if (result.type === 'failure') {
				error_message = result.data?.error_message
			}
			loading = false
		}
	}
</script>

<form
	action="/ask"
	class="max-h-[80vh] overflow-y-auto space-y-4"
	method="POST"
	use:enhance={ask_ai}
>
	{#each conversations as convo, i}
		<div class="p-2">
			<h3 class="h3">{convo.role}</h3>
			<input name="role[]" type="hidden" value={convo.role} />
			<p>{convo.message}</p>
			<input name="message[]" type="hidden" value={convo.message_with_context} />
		</div>
	{/each}

	<input name="role[]" type="hidden" value="user" />
	<Textarea label="Ask: " name="message[]" title="ask" value="" />
	<Button title="ask" type="submit" />
</form>
