<script lang="ts">
	import BlogCard from '$lib/components/blog_card.svelte'

	export let data
</script>

<div class="grid gap-2 grid-cols-[repeat(auto-fill,_minmax(32rem,_1fr))] justify-items-center">
	{#each data.blogs as blog, i}
		<BlogCard
			{blog}
			blog_likes={data.blog_likes?.filter((like) => like.blog_id === blog.blog_id)[0]}
		/>
	{/each}
</div>
