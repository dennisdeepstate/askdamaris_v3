<script lang="ts">
	import Ask from '$lib/components/ask.svelte'
	import '../app.postcss'

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom'
	import { initializeStores, Modal, storePopup } from '@skeletonlabs/skeleton'

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

	initializeStores()
</script>

<Modal>
	<Ask />
</Modal>
<slot />
