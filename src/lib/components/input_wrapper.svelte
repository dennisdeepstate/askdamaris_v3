<script lang="ts">
	import InputError from '$lib/components/input_error.svelte'

	export let errors: string[] | undefined
	export let label: string
</script>

<label class="label">
	<span>{label}</span>
	{#if errors && errors.length}
		<InputError {errors} />
	{/if}
	<slot />
</label>
