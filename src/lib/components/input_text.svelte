<script lang="ts">
	import InputWrapper from '$lib/components/input_wrapper.svelte'

	export let autocomplete: string | undefined = undefined
	export let errors: string[] | undefined = undefined
	export let label: string
	export let name: string
	export let placeholder: string | undefined = undefined
	export let value: string
	export let title: string
	export let type: 'password' | 'text' = 'text'
</script>

<InputWrapper {errors} {label}>
	{#if type === 'text'}
		<input {autocomplete} {name} {placeholder} type="text" bind:value {title} />
	{/if}
	{#if type === 'password'}
		<input {autocomplete} {name} {placeholder} type="text" bind:value {title} />
	{/if}
</InputWrapper>
