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
		.onConflictDoNothing({ target: sessions_table.id })

	if (new_session.length) {
		cookies.set('ask_damaris', new_session[0].id, {
			path: '/'
		})
	} else {
		await create_session({
			cookies,
			ip,
			tx,
			user_agent,
			user_id
		})
	}

	return new_session
}
async function get_session({
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
	if (!session_id) return
	const session = await tx
		.select({
			id: sessions_table.id,
			created_at: sessions_table.created_at,
			admin: users_table.admin,
			user_id: users_table.id,
			user_first_name: users_table.first_name,
			user_last_name: users_table.last_name
		})
		.from(sessions_table)
		.leftJoin(users_table, eq(users_table.id, sessions_table.user_id))
		.where(eq(sessions_table.id, session_id))
	if (!session.length) return
	const time_passed = new Date().valueOf() - session[0].created_at.valueOf()
	if (time_passed > 1000 * 60 * 60 * 24 * 3) {
		await delete_session({ cookies, tx })
		return
	} else {
		return session[0]
	}
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

async function verify_email_and_password_combination({
	email,
	password,
	tx
}: {
	email: string
	password: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const user = await tx
		.select({ user_id: users_table.id, hashed_password: users_table.password })
		.from(users_table)
		.where(eq(users_table.email, email))

	if (user.length && (await valid_password(user[0].hashed_password, password))) {
		return user
	} else {
		return []
	}
}

async function get_user_by_id({
	id,
	tx
}: {
	id: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const user = await tx
		.select({ user_id: users_table.id })
		.from(users_table)
		.where(eq(users_table.id, id))

	return user
}

async function get_user_by_email({
	email,
	tx
}: {
	email: string
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		Record<string, never>,
		ExtractTablesWithRelations<Record<string, never>>
	>
}) {
	const user = await tx
		.select({ user_id: users_table.id })
		.from(users_table)
		.where(eq(users_table.email, email))

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
		.onConflictDoNothing({ target: users_table.id })

	if (new_user.length < 1) {
		await create_user({ email, first_name, hashed_password, last_name, tx })
	}

	return new_user
}

async function hash_password(password: string) {
	const bcrypt = new Bcrypt()
	return await bcrypt.hash(password)
}

async function valid_password(hashed_password: string, password: string) {
	const bcrypt = new Bcrypt()
	return await bcrypt.verify(hashed_password, password)
}

export {
	create_session,
	create_user,
	delete_session,
	get_session,
	get_user_by_id,
	get_user_by_email,
	verify_email_and_password_combination,
	hash_password
}
