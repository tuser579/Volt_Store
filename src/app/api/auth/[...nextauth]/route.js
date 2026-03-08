import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? "demo",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "demo",
    }),
     CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === "password123") {
          return {
            id:    "1",
            name:  credentials.email.split("@")[0],
            email: credentials.email,
            image: null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error:  "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "volt-store-dev-secret",
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };