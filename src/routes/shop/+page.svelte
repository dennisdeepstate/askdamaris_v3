<script lang="ts">
	import ShopCard from '$lib/components/shop_card.svelte'

	export let data
</script>

{#each data.shop_items.items as item}
	<ShopCard {item} />
{/each}
