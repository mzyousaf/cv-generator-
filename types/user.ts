export type UserDocumentFields = {
  email: string;
  name: string;
  image?: string;
};

/** Stored only for email/password accounts; never expose to clients. */
export type UserAuthFields = UserDocumentFields & {
  passwordHash?: string;
};
