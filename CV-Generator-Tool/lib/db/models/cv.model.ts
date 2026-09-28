import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { DEFAULT_CV_TEMPLATE } from "@/lib/cv/constants";
import type { CVContent } from "@/types/cv";

const cvContentSchema = new Schema<CVContent>(
  {
    personal: { type: Schema.Types.Mixed },
    summary: { type: String },
    workExperience: { type: [Schema.Types.Mixed], default: [] },
    education: { type: [Schema.Types.Mixed], default: [] },
    skills: { type: [Schema.Types.Mixed], default: [] },
    projects: { type: [Schema.Types.Mixed], default: [] },
    certifications: { type: [Schema.Types.Mixed], default: [] },
    languages: { type: [Schema.Types.Mixed], default: [] },
    customSections: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    _id: false,
    strict: false,
  },
);

const cvSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    template: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      default: DEFAULT_CV_TEMPLATE,
    },
    content: {
      type: cvContentSchema,
      default: () => ({
        personal: {},
        summary: "",
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
      }),
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

cvSchema.virtual("id").get(function idGetter() {
  return String(this._id);
});

cvSchema.index({ userId: 1, updatedAt: -1 });

export type CVSchema = InferSchemaType<typeof cvSchema>;

export const CVModel =
  (mongoose.models.CV as mongoose.Model<CVSchema>) ??
  mongoose.model<CVSchema>("CV", cvSchema);
