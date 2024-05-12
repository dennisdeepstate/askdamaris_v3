<script lang="ts">
	export let blog: {
		author_first_name: string | null
		author_last_name: string | null
		created_at: Date
		tags: string | null
		thumb: string
		title: string
	}
	export let blog_comments:
		| {
				blog_id: string | null
				comment: string | null
				comment_author_id: string | null
				comment_author_first_name: string | null
				comment_author_last_name: string | null
		  }[]
		| undefined
</script>

<h1>{blog.title}</h1>
<img alt={blog.title} src={blog.thumb} />
<span>{blog.created_at}</span>
<span>{blog.author_first_name} {blog.author_last_name}</span>
<span> {blog.tags} </span>
<p>
	<slot />
</p>

{#if blog_comments && blog_comments.length}
	{#each blog_comments as blog_comment}
		<span>{blog_comment.comment_author_first_name} {blog_comment.comment_author_last_name}</span>
		<p>{blog_comment.comment}</p>
	{/each}
{/if}
