<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton'
</script>

<AppBar padding="px-16 py-4">
	<svelte:fragment slot="lead">icon</svelte:fragment>
	<svelte:fragment slot="trail">
		<ul class="space-x-2">
			<a class="anchor" href="/">About</a>
			<a class="anchor" href="/">Courses</a>
			<a class="anchor" href="/">Books</a>
			<a class="anchor" href="/">Contact</a>
		</ul>
		<span class="divider-vertical h-4" />
		<ul class="space-x-2">
			<a class="anchor" href="/">instagram</a>
			<a class="anchor" href="/">youtube</a>
		</ul>
	</svelte:fragment>
</AppBar>
