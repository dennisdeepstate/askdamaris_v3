<script lang="ts">
	export let blog: {
		author_first_name: string | null
		author_last_name: string | null
		blog: string
		created_at: Date
		tags: string | null
		thumb: string
		title: string
	}
</script>

<h1>{blog.title}</h1>
<img alt={blog.title} src={blog.thumb} />
<span>{blog.created_at}</span>
<span>{blog.author_first_name} {blog.author_last_name}</span>
<span>{blog.tags}</span>
<p>
	{blog.blog}
</p>
