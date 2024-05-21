<script lang="ts">
	export let data
</script>

{#each data.course_videos as video}
	<div class="relative h-[36rem]">
		<iframe
			src="https://iframe.mediadelivery.net/embed/{video.video_id}?autoplay=true"
			title={video.video_title}
			loading="lazy"
			style="border: none; position: absolute; top: 0; height: 100%; width: 100%;"
			allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
			allowfullscreen
		>
		</iframe>
	</div>
{/each}
