<script lang="ts">
	export let blog
	export let blog_likes
</script>

<div class="grid grid-cols-2 card m-4 relative max-w-[40rem] hover:shadow-2xl transition-shadow">
	<div class="my-4 space-y-4 px-4">
		<a class="anchor" href="/blog/{blog.blog_id}-{blog.title}">
			<span class="h4 font-bold text-center">{blog.title}</span>
		</a>
		<p>
			{blog.blog.slice(0, 128)}...
			<a class="anchor" href="/blog/{blog.blog_id}-{blog.title}">read more</a>
		</p>
		<div class="absolute bottom-2 grid grid-cols-2 left-0 px-4 w-[50%]">
			<span>{blog.author_first_name} {blog.author_last_name}</span>
			<div class="relative grid justify-end">
				{#if blog_likes}
					<span class="text-right">{blog_likes?.likes}</span>
				{/if}
			</div>
		</div>
	</div>
	<div class="bg-primary-500 h-[24rem] rounded-r-md">
		<img alt={blog.thumb} class="h-full w-full rounded-r-md" src={blog.thumb} />
	</div>
</div>
