import * as v from 'valibot'

const email_schema = v.nonOptional(v.string([v.toTrimmed(), v.email('Please enter a valid email')]))
const password_schema = v.nonOptional(
	v.string([v.minLength(8, 'Please enter a password that is atleast 8 characters long')])
)
const name_schema = v.nonOptional(
	v.string([
		v.toTrimmed(),
		v.minLength(3, 'Please enter a name that is atleast 3 characters long'),
		v.maxLength(32, 'Please enter a name that does not exceed 32 characters in length')
	])
)

const sign_up_schema = v.object({
	email: email_schema,
	first_name: name_schema,
	last_name: name_schema,
	password: password_schema
})

const sign_in_schema = v.object({
	email: email_schema,
	password: password_schema
})

function validate_sign_up(sign_up: {
	email: string
	first_name: string
	last_name: string
	password: string
}) {
	return v.safeParse(sign_up_schema, sign_up)
}

function validate_sign_in(sign_in: { email: string; password: string }) {
	return v.safeParse(sign_in_schema, sign_in)
}

export { validate_sign_in, validate_sign_up }
