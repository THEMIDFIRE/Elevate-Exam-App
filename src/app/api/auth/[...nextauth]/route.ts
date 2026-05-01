import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { USER_ROLES } from "@/shared/lib/constants/api.constant";

// const TEMP_ROLE_OVERRIDE = process.env.NEXTAUTH_TEMP_ROLE_OVERRIDE;
// type RoleValue = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// function getTemporaryRoleOverride(): RoleValue | undefined {
//     if (!TEMP_ROLE_OVERRIDE) {
//         return;
//     }

//     const validRoles = Object.values(USER_ROLES) as RoleValue[];

//     if (validRoles.includes(TEMP_ROLE_OVERRIDE as RoleValue)) {
//         return TEMP_ROLE_OVERRIDE as RoleValue;
//     }
// }

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: credentials?.username, password: credentials?.password })
                })
                const res = await data.json()

                if (!res.status) {
                    throw new Error(res.message)
                }
                const user = res.payload

                return {
                    accessToken: res.payload.token,
                    id: user.user.id,
                    user: user.user
                }
            },
        })
    ],
    callbacks: {
        jwt: ({ token, user, trigger, session }) => {
            if (user) {
                token.accessToken = user.accessToken
                token.user = user.user
            }
            if (trigger === 'update' && session) {
                token.user = session.user;
                token.accessToken = session.accessToken
            }

            // Temporary local override for role testing in non-production setups.
            // const roleOverride = getTemporaryRoleOverride()
            // if (roleOverride && token.user) {
            //     token.user.role = roleOverride
            // }
            return token
        },
        session: ({ session, token }) => {
            session.user = token.user
            
            return session
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }