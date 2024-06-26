import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

//data - user - login
const login = async ({email, senha}: {email?: string, senha?: string }) => {
    return await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: senha
        })
    })

}

const nextAuthOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				password: { label: 'password', type: 'password' }
			},

			async authorize(credentials, req) {
				const response = await
                 login({email: credentials?.email, senha:credentials?.password})

				const user = await response.json()

				if (user && response.ok) {
					return user
				}
				return null
			},
		})
	],
	pages: {
		signIn: '/'
	},
	callbacks: {
		async jwt({ token, user }) {
			user && (token.user = user)
			return token
		},
		async session({ session, token }){
			session = token.user as any
			return session
		}
	}
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }