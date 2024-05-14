<script lang="ts">
	export let item
</script>

<div class="grid grid-cols-2 card m-4 relative max-w-[24rem] hover:shadow-2xl transition-shadow">
	<div class="my-4 space-y-4 px-4">
		<a class="anchor" href="/shop/{item.item_id}">
			<span class="h4 font-bold text-center">{item.title}</span>
		</a>
		<div class="absolute bottom-2 grid grid-cols-2 left-0 px-4 w-[50%]">
			<!-- <span>{blog.author_first_name} {blog.author_last_name}</span>
			<div class="relative grid justify-end">
				{#if blog_likes}
					<span class="text-right">{blog_likes?.likes}</span>
				{/if}
			</div> -->
		</div>
	</div>
	<div class="bg-primary-500 h-[24rem] rounded-r-md">
		<img alt={item.title} class="h-full w-full rounded-r-md" src={item.thumb} />
	</div>
</div>
