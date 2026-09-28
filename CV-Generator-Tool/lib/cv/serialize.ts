import type { CVContent } from "@/types/cv";

export type CvRecord = {
  id: string;
  title: string;
  template: string;
  content: CVContent;
  createdAt: string;
  updatedAt: string;
};

type CvLikeDocument = {
  _id: { toString(): string };
  get(path: string): unknown;
};

export function serializeCvDocument(doc: CvLikeDocument): CvRecord {
  return {
    id: doc._id.toString(),
    title: String(doc.get("title")),
    template: String(doc.get("template")),
    content: (doc.get("content") as CVContent) ?? {},
    createdAt: (doc.get("createdAt") as Date).toISOString(),
    updatedAt: (doc.get("updatedAt") as Date).toISOString(),
  };
}

export function serializeCvDocumentWithOwner(
  doc: CvLikeDocument,
): CvRecord & { userId: string } {
  return {
    ...serializeCvDocument(doc),
    userId: String(doc.get("userId")),
  };
}
