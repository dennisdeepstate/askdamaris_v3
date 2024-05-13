<script lang="ts">
	export let blog
	export let blog_likes
</script>

<div class="grid grid-cols-2 card w-[32rem] m-4 relative">
	<div class="my-4 space-y-4 px-2">
		<span class="h4 font-bold text-center">{blog.title}</span>
		<p>
			{blog.blog.slice(0, 256)}...
			<a class="anchor" href="/blog/{blog.blog_id}-{blog.title}">read more</a>
		</p>
		<div class="absolute bottom-2 grid grid-cols-2">
			<span>{blog.author_first_name} {blog.author_last_name}</span>
			<div class="relative grid justify-end">
				<span class="text-right">{blog_likes[0].likes}</span>
			</div>
		</div>
	</div>
	<div class="bg-primary-500 h-[24rem] rounded-r-md">
		<img alt={blog.thumb} class="h-full w-full rounded-r-md" src={blog.thumb} />
	</div>
</div>
