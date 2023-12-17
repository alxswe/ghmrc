import { authClient } from "@/components/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface User {
        id: number;
        image: string;
        username: string;
        first_name: string;
        last_name: string;
        name: string;
        is_set: boolean;
        email: string;
        is_superuser: boolean;
        is_staff: boolean;
        is_active: boolean;
        date_joined: string;
        last_login: string;
        access_type: "Superuser" | "Staff" | "Member";
    }
    interface Session extends DefaultSession {
        accessToken: string;
        refreshToken: string;
        account: Record<string, any>;
        token: Record<string, any>;
        profile: Record<string, any>;
        key: string;
        user?: User;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions = (_req: NextApiRequest, res: NextApiResponse): NextAuthOptions => ({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    callbacks: {
        async signIn(req) {
            return true;
        },
        jwt: async ({ token, user, account, profile, session, trigger }) => {
            if (trigger === "signIn" && account?.provider === "github") {
                let key: string = "";
                try {
                    const response = await authClient.post<{ key: string }>("gh_login", {
                        access_token: account?.access_token,
                    });
                    const cookies: any = response.headers["set-cookie"];
                    res.setHeader("Set-Cookie", cookies);
                    key = response.data.key;
                } catch (err) {
                    return { token, account, profile };
                }

                return { token, account, key, profile };
            }

            // Credentials
            return token;
        },
        session: async ({ session, token, ..._ }): Promise<any> => {
            if (token.key) {
                // @ts-expect-error: Key may or may not be in the token key
                session.key = token.key;
            }

            if (token.account) {
                session.account = token.account;
            }

            if (token.profile) {
                session.profile = token.profile;
            }

            const f = {
                ...token,
                ...session,
                user: session.token ?? null,
            };

            if (!f.key) {
                return null;
            }

            return f;
        },
    },
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: NextApiRequest; res: NextApiResponse }) => {
    return getServerSession(ctx.req, ctx.res, authOptions(ctx.req, ctx.res));
};
