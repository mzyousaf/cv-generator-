import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import authConfig from "@/auth.config";
import { normalizeAuthEmail, resolveJwtSub } from "@/lib/auth/resolve-jwt-sub";
import { verifyPassword } from "@/lib/auth/password";

/** Too many sign-in attempts; the login form shows a "wait and retry" message. */
class RateLimitedSignin extends CredentialsSignin {
  code = "rate_limited";
}

function requestIp(request: Request | undefined): string {
  return (
    request?.headers.get("x-real-ip")?.trim() ||
    request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password || email.length > 254 || password.length > 128) {
          return null;
        }

        // Stop password guessing: per IP and per account.
        const { RATE_LIMITS, checkRateLimit } = await import("@/lib/rate-limit");
        const { mongoRateLimitStore } = await import("@/lib/rate-limit-store");
        const [byIp, byEmail] = await Promise.all([
          checkRateLimit(RATE_LIMITS.loginIp, requestIp(request), mongoRateLimitStore),
          checkRateLimit(RATE_LIMITS.loginEmail, email, mongoRateLimitStore),
        ]);
        if (!byIp.ok || !byEmail.ok) {
          throw new RateLimitedSignin();
        }

        const { connectToDatabase } = await import("@/lib/db/connect");
        const { UserModel } = await import("@/lib/db/models");
        await connectToDatabase();

        const user = await UserModel.findOne({ email }).select("+passwordHash");
        if (!user?.passwordHash) {
          return null;
        }

        const passwordHash = user.get("passwordHash") as string | undefined;
        if (!passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(password, passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: String(user._id),
          email: String(user.email),
          name: String(user.name),
          image: user.get("image") ? String(user.get("image")) : undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      const { connectToDatabase } = await import("@/lib/db/connect");
      const { UserModel } = await import("@/lib/db/models");
      await connectToDatabase();

      const email = normalizeAuthEmail(user.email);
      let dbUser = await UserModel.findOne({ email }).select("+passwordHash");

      if (!dbUser) {
        dbUser = await UserModel.create({
          email,
          name: user.name?.trim() || email,
          image: user.image ?? undefined,
          emailVerified: new Date(),
        });
      } else {
        let shouldSave = false;
        if (!dbUser.get("emailVerified")) {
          // Email sign-up doesn't verify addresses, so anyone could have registered this
          // email first. Google proves the owner signed in now: drop that unverified
          // password so a pre-registered account can't be used to read their CVs.
          if (dbUser.get("passwordHash")) {
            dbUser.set("passwordHash", undefined);
          }
          dbUser.set("emailVerified", new Date());
          shouldSave = true;
        }
        if (user.image && !dbUser.image) {
          dbUser.image = user.image;
          shouldSave = true;
        }
        if (user.name?.trim() && dbUser.name !== user.name.trim()) {
          dbUser.name = user.name.trim();
          shouldSave = true;
        }
        if (shouldSave) {
          await dbUser.save();
        }
      }

      user.id = String(dbUser._id);
      return true;
    },
    async jwt({ token, user, account }) {
      if (!user) {
        return token;
      }

      const { connectToDatabase } = await import("@/lib/db/connect");
      const { UserModel } = await import("@/lib/db/models");
      await connectToDatabase();

      const resolved = await resolveJwtSub(user, account ?? null, async (email) => {
        const dbUser = await UserModel.findOne({ email });
        if (!dbUser) {
          return null;
        }
        const image = dbUser.get("image");
        return {
          id: String(dbUser._id),
          name: String(dbUser.get("name")),
          email: String(dbUser.get("email")),
          image: image ? String(image) : undefined,
        };
      });

      if (resolved) {
        token.sub = resolved.sub;
        if (resolved.dbUser) {
          token.name = resolved.dbUser.name;
          token.email = resolved.dbUser.email;
          token.picture = resolved.dbUser.image;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized: authConfig.callbacks?.authorized,
  },
});
