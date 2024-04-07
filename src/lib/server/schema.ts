import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core'

const users_table = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull(),
	first_name: text('first_name').notNull(),
	last_name: text('last_name').notNull(),
	password: text('password').notNull(),
	verified: boolean('verified').notNull().default(false),
	verification_code: text('verification_code'),
	verified_code_created_at: timestamp('verification_code_created_at', { withTimezone: true })
})

const sessions_table = pgTable('sessios', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id').references(() => users_table.id),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	user_agent: text('user_agent')
})

const courses_table = pgTable('courses', {
	id: serial('id').notNull().primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	price: integer('price').notNull(),
	thumb: text('thumb').notNull()
})

const user_to_courses_table = pgTable(
	'user_to_courses',
	{
		course_id: integer('course_id').references(() => courses_table.id),
		mpesa_tx: integer('mpesa_tx').references(() => mpesa_stk_table.id),
		user_id: text('user_id').references(() => users_table.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.course_id, table.user_id] })
	})
)

const videos_table = pgTable('videos', {
	id: serial('id').notNull().primaryKey(),
	bunny_id: text('bunny_id').notNull(),
	premium: boolean('verified').notNull().default(true),
	title: text('title').notNull(),
	thumb: text('thumb').notNull()
})

const video_ratings_table = pgTable(
	'video_ratings',
	{
		user_id: text('user_id').references(() => users_table.id),
		video_id: integer('video_id').references(() => videos_table.id),
		rating: smallint('rating').notNull()
	},
	(table) => ({
		pk: primaryKey({ columns: [table.user_id, table.video_id] })
	})
)

const video_comments_table = pgTable('video_comments', {
	id: serial('id').notNull().primaryKey(),
	user_id: text('user_id').references(() => users_table.id),
	video_id: integer('video_id').references(() => videos_table.id),
	comment: text('comment').notNull()
})

const video_to_course_table = pgTable(
	'video_to_course',
	{
		course_id: integer('video_id').references(() => courses_table.id),
		video_id: integer('video_id').references(() => videos_table.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.course_id, table.video_id] })
	})
)

const mpesa_stk_table = pgTable('mpesa_stk', {
	id: serial('id').notNull().primaryKey(),
	amount: text('amount').notNull(),
	checkout_request_id: text('checkout_request_id').notNull()
})
