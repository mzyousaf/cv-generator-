import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;
export { auth as proxy };

export const config = {
  matcher: ["/dashboard/:path*"],
};
