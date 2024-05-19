<script lang="ts">
	export let item
</script>

<div class="card grid h-[36rem] w-[24rem] grid-rows-2">
	<div class="p-6 z-0">
		<div class="relative h-full w-full">
			<div class="bg-primary-500 relative rounded h-full w-full z-20">
				<img alt={item.title} class="h-full w-full" src={item.thumb} />
				<button class="btn-icon variant-ghost-primary">add to cart</button>
			</div>
			<div
				class="absolute top-2 left-2 border border-secondary-500 h-full rounded w-full z-10"
			></div>
		</div>
	</div>
	<div class="p-6">
		<div class="grid">
			<h3 class="h3">{item.title}</h3>
			<h3 class="h3">{item.price}</h3>
		</div>
		<p>{item.description}</p>
		<button class="btn variant-filled-primary">Buy now!</button>
	</div>
</div>
