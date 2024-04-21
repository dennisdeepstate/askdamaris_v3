<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/button.svelte'
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
		return async ({ result }) => {
			if (result.type === 'failure') {
				error_message = result.data?.message
				issues = result.data?.issues
			}
		}
	}
</script>

<form action="/" method="post" use:enhance={submit_form}>
	<InputText
		autocomplete="email"
		label="Email: "
		name="email"
		placeholder="john.doe@example.com"
		bind:value={email}
		title="Your email address"
	/>
	<InputText
		autocomplete="current-password"
		label="Password: "
		name="password"
		placeholder="******"
		bind:value={password}
		title="Your password"
		type="password"
	/>
	<Button title="Sign up" type="submit" />
</form>
