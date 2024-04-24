<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/button.svelte'
	import InputError from '$lib/components/input_error.svelte'
	import InputText from '$lib/components/input_text.svelte'
	import { validate_sign_up } from '$lib/shared/user_input_validation'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { SchemaIssues } from 'valibot'

	export let email: string
	export let first_name: string
	export let last_name: string
	export let password: string
	export let issues: SchemaIssues | undefined
	export let error_message: string | undefined

	const submit_form: SubmitFunction = ({ cancel }) => {
		const validated_input = validate_sign_up({
			email,
			first_name,
			last_name,
			password
		})
		if (!validated_input.success) {
			issues = validated_input.issues
			cancel()
		}
		return async ({ update, result }) => {
			if (result.type === 'failure') {
				error_message = result.data?.message
				issues = result.data?.issues
			}
			update()
		}
	}
</script>

<form action="/auth/signup" method="post" use:enhance={submit_form}>
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
		autocomplete="given-name"
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'first_name')
			.map((issue) => issue.message)}
		label="First name: "
		name="first_name"
		placeholder="John"
		bind:value={first_name}
		title="Your first name"
	/>
	<InputText
		autocomplete="family-name"
		errors={issues
			?.filter((issue) => issue.path && issue.path[0].key === 'last_name')
			.map((issue) => issue.message)}
		label="Last name: "
		name="last_name"
		placeholder="Doe"
		bind:value={last_name}
		title="Your last name"
	/>
	<InputText
		autocomplete="new-password"
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
	<Button title="Sign up" type="submit" />
</form>
