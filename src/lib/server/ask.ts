import { OpenAI } from 'openai'
import { OPEN_AI_KEY } from '$env/static/private'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { blogs_table, embeddings_table } from './schema'
import { eq, sql, type ExtractTablesWithRelations } from 'drizzle-orm'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY
})

async function create_embedding(input: string) {
	const embeddings = await openai.embeddings.create({
		model: 'text-embedding-ada-002',
		input,
		encoding_format: 'float'
	})

	return embeddings.data.flatMap((emb) => emb.embedding)
}

const system_message = {
	role: 'system',
	content:
		'You are a Q&A assistant for a real website, askdamaris.com which is a career website that contains blogs, ebooks and videos by Damaris Kakundi where she provides valuable information about how to achieve career and personal growth'
}

async function add_context(
	message: string,
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
) {
	const message_embeddings = `${embeddings_table.embedding} <-> ARRAY[${(await create_embedding(message)).join(',')}]::real[]`
	const matching_content = await tx
		.select({
			id: embeddings_table.id,
			blog_id: embeddings_table.blog_id,
			blog_content: blogs_table.blog_markdown
		})
		.from(embeddings_table)
		.leftJoin(blogs_table, eq(blogs_table.id, embeddings_table.blog_id))
		.orderBy(sql`${message_embeddings}`)
		.limit(1)

	let message_with_context = message
	console.log(matching_content)
	if (matching_content[0].blog_content) {
		message_with_context = `Use the blog provided below to get context on the question\n blog:${matching_content[0].blog_content}\n`
	}

	return {
		role: 'system',
		content: message_with_context
	}
}

async function ask_open_ai(conversation: { role: string; content: string }[]) {
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: conversation as ChatCompletionMessageParam[],
		temperature: 0.4,
		max_tokens: 64,
		top_p: 1
	})

	return response.choices[0].message.content
}

export { add_context, ask_open_ai, create_embedding, system_message }
