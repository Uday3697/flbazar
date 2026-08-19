import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmailOrPhone } from "@/lib/data-store";
import { verifyPassword } from "@/lib/security";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Email or mobile",
      credentials: {
        login: { label: "Email or mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = String(credentials?.login || "").trim();
        const password = String(credentials?.password || "");

        if (!login || !password) {
          return null;
        }

        const user = await getUserByEmailOrPhone(login);
        if (!user?.passwordHash) {
          return null;
        }

        if (!verifyPassword(password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
});
