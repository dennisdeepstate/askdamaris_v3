<script lang="ts">
	import Textarea from '$lib/components/textarea.svelte'
	import Button from '$lib/components/button.svelte'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'

	let conversations: { role: 'assistant' | 'user'; message: string }[] = [
		{
			role: 'assistant',
			message: 'ask damaris...'
		}
	]
	let conversations_with_context = [...conversations]
	let error_message: string | undefined
	let loading = false

	const ask_ai: SubmitFunction = async ({ formData, cancel }) => {
		if (loading) cancel()
		error_message = undefined
		loading = true
		conversations.push({
			role: 'user',
			message: formData.getAll('message[]').pop()?.toString() ?? ''
		})
		return async ({ result }) => {
			if (result.type === 'success' && result.data?.answer && result.data?.message_with_context) {
				conversations_with_context.push({ role: 'user', message: result.data.message_with_context })
				conversations = [...conversations, { role: 'assistant', message: result.data.answer }]
				conversations_with_context = [
					...conversations_with_context,
					{ role: 'assistant', message: result.data.answer }
				]
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
			<input name="role[]" type="hidden" value={conversations_with_context[i].role} />
			<p>{convo.message}</p>
			<input name="message[]" type="hidden" value={conversations_with_context[i].message} />
		</div>
	{/each}

	<input name="role[]" type="hidden" value="user" />
	<Textarea label="Ask: " name="message[]" title="ask" value="" />
	<Button title="ask" type="submit" />
</form>
