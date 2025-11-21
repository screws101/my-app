import NextAuth from "next-auth";

export const { auth } = NextAuth({
  providers: [],
  pages: { signIn: "/auth/signin" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const path = request.nextUrl.pathname;
      const protectedRoutes =
        path.startsWith("/add-profile") ||
        (path.startsWith("/profile/") && path.endsWith("/edit"));

      if (!isLoggedIn && protectedRoutes) return false;
      return true;
    },
  },
});


