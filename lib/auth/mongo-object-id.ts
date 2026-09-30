import mongoose from "mongoose";

/** Strict check: 24 hex chars and accepted by Mongoose (excludes UUIDs and other cast failures). */
export function isValidMongoObjectIdString(id: string): boolean {
  return (
    typeof id === "string" &&
    /^[a-fA-F0-9]{24}$/.test(id) &&
    mongoose.Types.ObjectId.isValid(id)
  );
}
