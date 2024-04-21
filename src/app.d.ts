// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		session:
			| {
					id: string
					created_at: Date
					user_id: string
					user_first_name: string
					user_last_name: string
					thumb?: string | null
			  }
			| undefined
	}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}
