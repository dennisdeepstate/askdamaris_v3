<script lang="ts">
	export let title: string
	export let type: 'submit' | 'button' = 'button'
</script>

<button class="btn" {type}>{title}</button>
