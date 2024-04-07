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
	let carousel_child: HTMLImageElement
	let scroll_on: boolean = true

	function carousel_right(): void {
		const x =
			carousel_element.scrollWidth - carousel_element.scrollLeft < carousel_child.clientWidth
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

<section class="max-h-[100vh] w-[100vw]">
	<div
		bind:this={carousel_element}
		class="snap-center snap-x snap-mandatory scroll-smooth flex overflow-x-auto max-h-full w-full"
	>
		{#each thumbnails as thumbnail}
			<div class="relative snap-center shrink-0 rounded-container-token max-h-full w-full">
				<img
					class="m-auto rounded-container-token max-h-full w-auto"
					src="https://source.unsplash.com/{thumbnail}/1024x768"
					alt={thumbnail}
					loading="lazy"
					bind:this={carousel_child}
				/>
				<h1 class="h1 absolute top-0">
					{thumbnail}
				</h1>
			</div>
		{/each}
	</div>
</section>
