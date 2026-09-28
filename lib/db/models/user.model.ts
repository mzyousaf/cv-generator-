import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    passwordHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        const record = ret as Record<string, unknown> & { _id: unknown };
        record.id = String(record._id);
        delete record._id;
        delete record.__v;
        return record;
      },
    },
    toObject: {
      virtuals: true,
      transform(_doc, ret) {
        const record = ret as Record<string, unknown> & { _id: unknown };
        record.id = String(record._id);
        delete record._id;
        delete record.__v;
        return record;
      },
    },
  },
);

userSchema.virtual("id").get(function idGetter() {
  return String(this._id);
});

export type UserSchema = InferSchemaType<typeof userSchema>;

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserSchema>) ??
  mongoose.model<UserSchema>("User", userSchema);
