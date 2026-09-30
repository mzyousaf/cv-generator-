import { isValidMongoObjectIdString } from "@/lib/auth/mongo-object-id";

export type AuthUserForJwt = {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export type AuthAccountForJwt = {
  provider?: string;
} | null;

export type DbUserForJwt = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export function normalizeAuthEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Resolves the application user id (MongoDB User._id as string) for JWT `sub`.
 * Never trusts OAuth/provider UUIDs in `user.id`.
 */
export async function resolveJwtSub(
  user: AuthUserForJwt,
  account: AuthAccountForJwt,
  findUserByEmail: (email: string) => Promise<DbUserForJwt | null>,
): Promise<{ sub: string; dbUser?: DbUserForJwt } | null> {
  if (
    account?.provider === "credentials" &&
    user.id &&
    isValidMongoObjectIdString(user.id)
  ) {
    return { sub: user.id };
  }

  if (user.email) {
    const dbUser = await findUserByEmail(normalizeAuthEmail(user.email));
    if (dbUser) {
      return { sub: dbUser.id, dbUser };
    }
  }

  if (user.id && isValidMongoObjectIdString(user.id)) {
    return { sub: user.id };
  }

  return null;
}
