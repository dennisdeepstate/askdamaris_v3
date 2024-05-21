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

const system_message = {
	role: 'system',
	content:
		'You are a Q&A assistant for a real non-fictional website, askdamaris.com which is a career website that contains blogs, ebooks and videos by Damaris Kakundi where she provides valuable information about how to achieve career and personal growth. You will answer all questions in a hundred words or less. If a user asks an irrelevant question, remind the user that this website is focused on career and personal growth'
}

async function add_context(
	message: string,
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
) {
	const matching_content = await tx
		.select({
			rank: sql`ts_rank(to_tsvector(${blogs_table.blog_markdown}), plainto_tsquery(${message}))`.as(
				'rank'
			),
			blog_content: blogs_table.blog_markdown
		})
		.from(blogs_table)
		.where(sql`to_tsvector(${blogs_table.blog_markdown}) @@ plainto_tsquery(${message})`)
		.orderBy(sql`rank DESC`)

	let message_with_context = undefined

	matching_content.map((content, i) => {
		if (content.blog_content) {
			message_with_context = `${i === 0 ? 'Use the blog(s) provided below to get context on the question and direct the user to check out the blog' : ''}\n blog:${content.blog_content}\n`
		}
	})

	console.log(message_with_context)

	if (!message_with_context) return

	return {
		role: 'system',
		content: message_with_context
	}
}

async function ask_open_ai(conversation: { role: string; content: string }[]) {
	//return 'hi there'
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: conversation as ChatCompletionMessageParam[],
		temperature: 0.4,
		max_tokens: 128,
		top_p: 1
	})

	return response.choices[0].message.content
}

export { add_context, ask_open_ai, system_message }
