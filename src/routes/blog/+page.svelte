<script lang="ts">
	import Blog from '$lib/components/blog.svelte'

	export let data
</script>

{#each data.blogs as blog}
	<Blog {blog}>{blog.blog}</Blog>
{/each}
