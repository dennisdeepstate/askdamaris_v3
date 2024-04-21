export async function load({ locals }) {
	const user = locals.session
	return {
		user
	}
}
