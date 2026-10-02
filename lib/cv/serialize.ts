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

// Mongoose subdocuments carry circular parent refs; React's server action
// serializer recurses on them, so hand back a plain JSON copy instead.
function toPlainContent(value: unknown): CVContent {
  if (value == null) {
    return {} as CVContent;
  }
  const plain =
    typeof (value as { toObject?: unknown }).toObject === "function"
      ? (value as { toObject(): unknown }).toObject()
      : value;
  return JSON.parse(JSON.stringify(plain)) as CVContent;
}

export function serializeCvDocument(doc: CvLikeDocument): CvRecord {
  return {
    id: doc._id.toString(),
    title: String(doc.get("title")),
    template: String(doc.get("template")),
    content: toPlainContent(doc.get("content")),
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
