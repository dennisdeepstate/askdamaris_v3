import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { DB_CONNECTION_STRING } from '$env/static/private'

const queryClient = postgres(DB_CONNECTION_STRING)
const db = drizzle(queryClient)

export default db
