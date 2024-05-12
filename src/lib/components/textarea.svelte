<script lang="ts">
	import InputWrapper from '$lib/components/input_wrapper.svelte'

	export let autocomplete: string | undefined = undefined
	export let errors: string[] | undefined = undefined
	export let label: string
	export let name: string
	export let placeholder: string | undefined = undefined
	export let value: string
	export let title: string
</script>

<InputWrapper {errors} {label}>
	<textarea {autocomplete} class="textarea" {name} {placeholder} bind:value {title} />
</InputWrapper>
