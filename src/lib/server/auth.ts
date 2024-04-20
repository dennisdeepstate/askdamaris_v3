import { and, eq, type ExtractTablesWithRelations } from 'drizzle-orm'
import { sessions_table, users_table } from '$lib/server/schema'
import { type PgTransaction } from 'drizzle-orm/pg-core'
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'
import { alphabet, generateRandomString } from 'oslo/crypto'
import type { Cookies } from '@sveltejs/kit'
import { Bcrypt } from 'oslo/password'

async function create_session({
	cookies,
	ip,
	tx,
	user_agent,
	user_id
}: {
	cookies: Cookies
	ip?: string | null
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
	user_agent?: string | null
	user_id: string
}) {
	const session_id = generateRandomString(128, alphabet('0-9', 'A-Z', 'a-z'))
	const new_session = await tx
		.insert(sessions_table)
		.values({
			id: session_id,
			created_at: new Date(),
			ip,
			user_agent,
			user_id
		})
		.returning({ id: sessions_table.id })

	if (new_session.length) {
		cookies.set('ask_damaris', new_session[0].id, {
			path: '/'
		})
	}

	return new_session
}

async function delete_session({
	cookies,
	tx
}: {
	cookies: Cookies
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const session_id = cookies.get('ask_damaris')
	if (session_id) {
		await tx.delete(sessions_table).where(eq(sessions_table.id, session_id))
	}
	cookies.delete('ask_damaris', {
		path: '/'
	})
}

async function get_user({
	email,
	hashed_password,
	tx
}: {
	email: string
	hashed_password: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const user = await tx
		.select({ user_id: users_table.id })
		.from(users_table)
		.where(and(eq(users_table.email, email), eq(users_table.password, hashed_password)))
	if (user.length) {
	}

	return user
}

async function create_user({
	email,
	first_name,
	hashed_password,
	last_name,
	tx
}: {
	email: string
	first_name: string
	hashed_password: string
	last_name: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const user_id = generateRandomString(16, alphabet('a-z', 'A-Z'))
	const new_user = await tx
		.insert(users_table)
		.values({ id: user_id, email, first_name, password: hashed_password, last_name })
		.returning({ id: users_table.id })
	return new_user
}

async function hash_password(password: string) {
	const bcrypt = new Bcrypt()
	return await bcrypt.hash(password)
}

export { create_session, create_user, delete_session, get_user, hash_password }
