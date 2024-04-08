import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp
} from 'drizzle-orm/pg-core'

export const users_table = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	admin: boolean('admin').notNull().default(false),
	email: text('email').notNull(),
	first_name: text('first_name').notNull(),
	last_name: text('last_name').notNull(),
	password: text('password').notNull(),
	verified: boolean('verified').notNull().default(false),
	verification_code: text('verification_code'),
	verification_code_created_at: timestamp('verification_code_created_at', { withTimezone: true })
})

export const sessions_table = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	user_id: text('user_id').references(() => users_table.id),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	user_agent: text('user_agent')
})

export const courses_table = pgTable('courses', {
	id: serial('id').notNull().primaryKey(),
	description: text('description').notNull(),
	price: integer('price').notNull(),
	thumb: text('thumb').notNull(),
	title: text('title').notNull()
})

export const user_to_courses_table = pgTable(
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

export const videos_table = pgTable('videos', {
	id: serial('id').notNull().primaryKey(),
	course_id: integer('video_id').references(() => courses_table.id),
	bunny_id: text('bunny_id').notNull(),
	description: text('description').notNull(),
	premium: boolean('verified').notNull().default(true),
	title: text('title').notNull(),
	thumb: text('thumb').notNull()
})

export const video_ratings_table = pgTable(
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

export const blogs_table = pgTable('blogs', {
	id: text('id').notNull().primaryKey(),
	author_id: text('author_id').references(() => users_table.id),
	blog_markdown: text('blog_markdown').notNull(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	tags: text('tags'),
	title: text('title').notNull(),
	thumb: text('thumb').notNull()
})

export const comments_table = pgTable('comments', {
	id: serial('id').notNull().primaryKey(),
	blog_id: text('blog_id').references(() => blogs_table.id),
	user_id: text('user_id').references(() => users_table.id),
	video_id: integer('video_id').references(() => videos_table.id),
	comment: text('comment').notNull(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})

export const comment_replies_table = pgTable('comment_replies', {
	id: serial('id').notNull().primaryKey(),
	comment_id: integer('comment_id').references(() => comments_table.id),
	user_id: text('user_id').references(() => users_table.id),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	reply: integer('reply').notNull()
})

export const blog_likes_table = pgTable(
	'blog_likes',
	{
		user_id: text('user_id').references(() => users_table.id),
		blog_id: integer('blog_id').references(() => blogs_table.id)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.user_id, table.blog_id] })
	})
)

export const categories_table = pgTable('categories', {
	name: text('name').notNull().primaryKey()
})

export const shop_items_table = pgTable('shop_items', {
	id: serial('id').notNull().primaryKey(),
	created_by: text('created_by')
		.notNull()
		.references(() => users_table.id),
	category: text('category')
		.notNull()
		.references(() => categories_table.name),
	description: text('description').notNull(),
	max_order_qty: integer('max_order_qty').notNull().default(10),
	min_order_qty: integer('min_order_qty').notNull().default(1),
	qty_at_hand: integer('qty_at_hand').notNull(),
	price: integer('price').notNull(),
	title: text('title').notNull(),
	thumb: text('thumb').notNull()
})

export const tx_types = pgEnum('tx_types', ['transfer_in', 'transfer_out', 'sale', 'return'])
export const shop_items_tx_table = pgTable('shop_items_tx', {
	id: serial('id').notNull().primaryKey(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	created_by: text('created_by')
		.notNull()
		.references(() => users_table.id),
	tx_type: tx_types('tx').notNull()
})

export const cart_table = pgTable('cart', {
	id: serial('id').notNull().primaryKey(),
	user_id: text('user_id').references(() => users_table.id),
	course_id: integer('course_id').references(() => courses_table.id),
	item_id: integer('item_id').references(() => shop_items_table.id),
	qty: integer('qty')
})

export const mpesa_stk_table = pgTable('mpesa_stk', {
	id: serial('id').notNull().primaryKey(),
	amount: text('amount').notNull(),
	checkout_request_id: text('checkout_request_id').notNull(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
