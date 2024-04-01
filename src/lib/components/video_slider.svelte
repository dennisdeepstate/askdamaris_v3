<script lang="ts">
	import { onDestroy, onMount } from 'svelte'

	export let thumbnails: string[] = [
		'vjUokUWbFOs',
		'1aJuPtQJX_I',
		'Jp6O3FFRdEI',
		'I3C_eojFVQY',
		's0fXOuyTH1M',
		'z_X0PxmBuIQ'
	]
	let carousel_element: HTMLDivElement
	let scroll_on: boolean = true

	function carousel_right(): void {
		const x =
			carousel_element.scrollLeft === carousel_element.scrollWidth - carousel_element.clientWidth
				? 0
				: carousel_element.scrollLeft + carousel_element.clientWidth // step right
		carousel_element.scroll(x, 0)
	}

	async function auto_scroll() {
		let scroll_timeout
		while (scroll_on) {
			clearTimeout(scroll_timeout)
			function carousel(): Promise<void> {
				return new Promise(function (resolve, reject): void {
					scroll_timeout = setTimeout(() => {
						carousel_right()
						resolve()
					}, 4000)
				})
			}
			await carousel()
		}
		clearTimeout(scroll_timeout)
	}

	onMount(() => auto_scroll())
	onDestroy(() => {
		scroll_on = false
	})
</script>

<section class="w-full">
	<div
		bind:this={carousel_element}
		class="snap-center snap-x snap-mandatory scroll-smooth flex overflow-x-auto w-[100vw]"
	>
		{#each thumbnails as thumbnail}
			<img
				class="snap-center rounded-container-token w-[100vw]"
				src="https://source.unsplash.com/{thumbnail}/1024x768"
				alt={thumbnail}
				loading="lazy"
			/>
		{/each}
	</div>
</section>
