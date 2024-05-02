<script lang="ts">
	import { enhance } from '$app/forms'
	import { updated } from '$app/stores'
	import Button from '$lib/components/button.svelte'
	import InputError from '$lib/components/input_error.svelte'
	import InputText from '$lib/components/input_text.svelte'
	import { validate_sign_in } from '$lib/shared/user_input_validation'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { SchemaIssues } from 'valibot'

	export let email: string
	export let password: string
	export let issues: SchemaIssues | undefined
	export let error_message: string | undefined

	const submit_form: SubmitFunction = ({ cancel }) => {
		const validated_input = validate_sign_in({
			email,
			password
		})
		if (!validated_input.success) {
			issues = validated_input.issues
			cancel()
		}
		return async ({ result, update }) => {
			if (result.type === 'failure') {
				error_message = result.data?.message
				issues = result.data?.issues
			} else {
				update()
			}
		}
	}
</script>

<form action="/auth" method="post" use:enhance={submit_form}>
	{#if error_message}
		<InputError errors={[error_message]} />
	{/if}
	<InputText
		autocomplete="email"
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'email')
			.map((issue) => issue.message)}
		label="Email: "
		name="email"
		placeholder="john.doe@example.com"
		bind:value={email}
		title="Your email address"
	/>
	<InputText
		autocomplete="current-password"
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'password')
			.map((issue) => issue.message)}
		label="Password: "
		name="password"
		placeholder="******"
		bind:value={password}
		title="Your password"
		type="password"
	/>
	<Button title="Sign In" type="submit" />
</form>
