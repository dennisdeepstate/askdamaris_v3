<script lang="ts">
	import BlogCard from '$lib/components/blog_card.svelte'

	export let data
</script>

{#each data.blogs as blog, i}
	<BlogCard {blog} blog_likes={data.blog_likes?.filter((like) => like.blog_id === blog.blog_id)} />
{/each}
