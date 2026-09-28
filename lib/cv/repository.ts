import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connect";
import { CVModel } from "@/lib/db/models";
import {
  serializeCvDocument,
  serializeCvDocumentWithOwner,
  type CvRecord,
} from "@/lib/cv/serialize";
import type { CVContent } from "@/types/cv";
import type { CvTemplateId } from "@/lib/cv/constants";

export type CvRecordWithOwner = CvRecord & { userId: string };

export type { CvRecord } from "@/lib/cv/serialize";

export type CreateCvRecordInput = {
  userId: string;
  title: string;
  template: CvTemplateId;
  content: CVContent;
};

export type UpdateCvRecordInput = {
  title?: string;
  template?: CvTemplateId;
  content?: CVContent;
};

async function ensureConnection() {
  await connectToDatabase();
}

export const cvRepository = {
  async create(input: CreateCvRecordInput): Promise<CvRecord> {
    await ensureConnection();

    const doc = await CVModel.create({
      userId: new mongoose.Types.ObjectId(input.userId),
      title: input.title,
      template: input.template,
      content: input.content,
    });

    return serializeCvDocument(doc);
  },

  async listByUserId(userId: string): Promise<CvRecord[]> {
    await ensureConnection();

    const docs = await CVModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ updatedAt: -1 })
      .exec();

    return docs.map((doc) => serializeCvDocument(doc));
  },

  async findById(cvId: string): Promise<CvRecordWithOwner | null> {
    await ensureConnection();

    if (!mongoose.Types.ObjectId.isValid(cvId)) {
      return null;
    }

    const doc = await CVModel.findById(cvId);
    if (!doc) {
      return null;
    }

    return serializeCvDocumentWithOwner(doc);
  },

  async updateOwned(
    cvId: string,
    userId: string,
    input: UpdateCvRecordInput,
  ): Promise<CvRecord | null> {
    await ensureConnection();

    if (!mongoose.Types.ObjectId.isValid(cvId)) {
      return null;
    }

    const update: Record<string, unknown> = {};
    if (input.title !== undefined) {
      update.title = input.title;
    }
    if (input.template !== undefined) {
      update.template = input.template;
    }
    if (input.content !== undefined) {
      update.content = input.content;
    }

    const doc = await CVModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(cvId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!doc) {
      return null;
    }

    return serializeCvDocument(doc);
  },

  async deleteOwned(cvId: string, userId: string): Promise<boolean> {
    await ensureConnection();

    if (!mongoose.Types.ObjectId.isValid(cvId)) {
      return false;
    }

    const result = await CVModel.deleteOne({
      _id: new mongoose.Types.ObjectId(cvId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    return result.deletedCount === 1;
  },
};

export type CvRepository = typeof cvRepository;
