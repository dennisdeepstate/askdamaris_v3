<script lang="ts">
	export let errors: string[]
</script>

{#each errors as error}
	<span class="text-error-500">
		{error}
	</span>
{/each}
