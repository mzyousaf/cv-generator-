import { auth } from "@/auth";
import { isValidMongoObjectIdString } from "@/lib/auth/mongo-object-id";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models";
import type { UserDocumentFields } from "@/types/user";

export type CurrentUser = UserDocumentFields & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Returns a MongoDB user id for lookup, or null if the session id is missing/invalid. */
export function resolveSessionUserIdForDbLookup(
  userId: string | undefined,
): string | null {
  if (!userId || !isValidMongoObjectIdString(userId)) {
    return null;
  }
  return userId;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const userId = resolveSessionUserIdForDbLookup(session?.user?.id);

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  const user = await UserModel.findById(userId);
  if (!user) {
    return null;
  }

  const image = user.get("image");

  return {
    id: String(user._id),
    email: String(user.get("email")),
    name: String(user.get("name")),
    image: image ? String(image) : undefined,
    createdAt: user.get("createdAt") as Date,
    updatedAt: user.get("updatedAt") as Date,
  };
}
