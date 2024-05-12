<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/button.svelte'
	import InputError from '$lib/components/input_error.svelte'
	import InputText from '$lib/components/input_text.svelte'
	import Textarea from '$lib/components/textarea.svelte'
	import { validate_blog_entry } from '$lib/shared/user_input_validation'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { SchemaIssues } from 'valibot'

	let title: string
	let blog: string
	let error_message: string | undefined
	let issues: SchemaIssues | undefined

	const submit_blog: SubmitFunction = ({ formData, cancel }) => {
		error_message = undefined
		issues = undefined
		const validation_result = validate_blog_entry({
			title: formData.get('title')?.toString(),
			blog: formData.get('blog')?.toString()
		})
		if (!validation_result.success) {
			issues = validation_result.issues
			cancel()
		}
		return async ({ update, result }) => {
			if (result.type === 'failure') {
				issues = result.data?.issues
			} else {
				update()
			}
		}
	}
</script>

<form method="post" use:enhance={submit_blog}>
	{#if error_message}
		<InputError errors={[error_message]} />
	{/if}
	<InputText
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'title')
			.map((issue) => issue.message)}
		label="title"
		name="title"
		type="text"
		placeholder="title"
		title="title"
		bind:value={title}
	/>
	<Textarea
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'blog')
			.map((issue) => issue.message)}
		label="Blog entry"
		name="blog"
		title="blog"
		bind:value={blog}
	/>
	<Button title="submit" type="submit" />
</form>
