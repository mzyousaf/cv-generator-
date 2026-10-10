import {
  CV_ERROR_CODES,
  CV_ERROR_MESSAGES,
  cvError,
  type CvResult,
} from "@/lib/cv/errors";
import { checkCvOwnership } from "@/lib/cv/ownership";
import { cvRepository, type CvRepository } from "@/lib/cv/repository";
import type { CvRecord } from "@/lib/cv/serialize";
import {
  isValidCvId,
  sanitizeCvContentPatch,
  validateCreateCvInput,
  validateUpdateCvInput,
} from "@/lib/cv/validation";
import type { CVContent } from "@/types/cv";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/get-current-user";
import { applyAccountPhoto, fetchAccountPhotoDataUrl } from "@/lib/cv/account-photo";

export type CreateCvPayload = {
  title?: unknown;
  template?: unknown;
  content?: unknown;
};

export type UpdateCvPayload = {
  title?: unknown;
  template?: unknown;
  content?: unknown;
};

type CvServiceDeps = {
  getUser: () => Promise<CurrentUser | null>;
  repository: CvRepository;
  /** Account profile picture as a CV photo data URL (null when unavailable). */
  getAccountPhoto?: (user: CurrentUser) => Promise<string | null>;
};

function mapValidationFailure(message: string): CvResult<never> {
  return cvError(CV_ERROR_CODES.INVALID_INPUT, message);
}

function handleDatabaseError(): CvResult<never> {
  return cvError(
    CV_ERROR_CODES.DATABASE_ERROR,
    CV_ERROR_MESSAGES.DATABASE_ERROR,
  );
}

export function createCvService(deps: CvServiceDeps) {
  async function requireAuthenticatedUser(): Promise<
    { ok: true; user: CurrentUser } | { ok: false; result: CvResult<never> }
  > {
    const user = await deps.getUser();
    if (!user) {
      return {
        ok: false,
        result: cvError(
          CV_ERROR_CODES.UNAUTHENTICATED,
          CV_ERROR_MESSAGES.UNAUTHENTICATED,
        ),
      };
    }

    return { ok: true, user };
  }

  return {
    async createCv(input: CreateCvPayload): Promise<CvResult<CvRecord>> {
      const authResult = await requireAuthenticatedUser();
      if (!authResult.ok) {
        return authResult.result;
      }

      let validated = validateCreateCvInput(input);
      if (!validated.ok) {
        return mapValidationFailure(validated.message);
      }

      // New CVs (blank, imported, AI-built) always use the account's picture.
      const accountPhoto = deps.getAccountPhoto
        ? await deps.getAccountPhoto(authResult.user)
        : null;
      if (accountPhoto) {
        const withPhoto = validateCreateCvInput({
          ...input,
          content: applyAccountPhoto(validated.value.content, accountPhoto),
        });
        if (withPhoto.ok) {
          validated = withPhoto;
        }
      }

      try {
        const data = await deps.repository.create({
          userId: authResult.user.id,
          title: validated.value.title,
          template: validated.value.template,
          content: validated.value.content,
        });

        return { success: true, data };
      } catch {
        return handleDatabaseError();
      }
    },

    async listCvsForCurrentUser(): Promise<CvResult<CvRecord[]>> {
      const authResult = await requireAuthenticatedUser();
      if (!authResult.ok) {
        return authResult.result;
      }

      try {
        const data = await deps.repository.listByUserId(authResult.user.id);
        return { success: true, data };
      } catch {
        return handleDatabaseError();
      }
    },

    async getCvForCurrentUser(cvId: string): Promise<CvResult<CvRecord>> {
      const authResult = await requireAuthenticatedUser();
      if (!authResult.ok) {
        return authResult.result;
      }

      if (!isValidCvId(cvId)) {
        return cvError(CV_ERROR_CODES.NOT_FOUND, CV_ERROR_MESSAGES.NOT_FOUND);
      }

      try {
        const cv = await deps.repository.findById(cvId);
        const ownership = checkCvOwnership(cv, authResult.user.id);
        if (!ownership.ok) {
          return cvError(
            ownership.code,
            CV_ERROR_MESSAGES[ownership.code],
          );
        }

        return {
          success: true,
          data: {
            id: cv!.id,
            title: cv!.title,
            template: cv!.template,
            content: cv!.content,
            createdAt: cv!.createdAt,
            updatedAt: cv!.updatedAt,
          },
        };
      } catch {
        return handleDatabaseError();
      }
    },

    async updateCvForCurrentUser(
      cvId: string,
      input: UpdateCvPayload,
    ): Promise<CvResult<CvRecord>> {
      const authResult = await requireAuthenticatedUser();
      if (!authResult.ok) {
        return authResult.result;
      }

      if (!isValidCvId(cvId)) {
        return cvError(CV_ERROR_CODES.NOT_FOUND, CV_ERROR_MESSAGES.NOT_FOUND);
      }

      const validated = validateUpdateCvInput(input);
      if (!validated.ok) {
        return mapValidationFailure(validated.message);
      }

      try {
        const existing = await deps.repository.findById(cvId);
        const ownership = checkCvOwnership(existing, authResult.user.id);
        if (!ownership.ok) {
          return cvError(
            ownership.code,
            CV_ERROR_MESSAGES[ownership.code],
          );
        }

        const updateInput: {
          title?: string;
          template?: (typeof validated.value)["template"];
          content?: CVContent;
        } = {
          title: validated.value.title,
          template: validated.value.template,
        };

        if (validated.value.contentPatch) {
          const mergedContent = sanitizeCvContentPatch(
            validated.value.contentPatch,
            existing!.content as CVContent,
          );
          if (!mergedContent.ok) {
            return mapValidationFailure(mergedContent.message);
          }
          updateInput.content = mergedContent.value;
        }

        const data = await deps.repository.updateOwned(
          cvId,
          authResult.user.id,
          updateInput,
        );

        if (!data) {
          return cvError(CV_ERROR_CODES.NOT_FOUND, CV_ERROR_MESSAGES.NOT_FOUND);
        }

        return { success: true, data };
      } catch {
        return handleDatabaseError();
      }
    },

    async deleteCvForCurrentUser(cvId: string): Promise<CvResult<{ id: string }>> {
      const authResult = await requireAuthenticatedUser();
      if (!authResult.ok) {
        return authResult.result;
      }

      if (!isValidCvId(cvId)) {
        return cvError(CV_ERROR_CODES.NOT_FOUND, CV_ERROR_MESSAGES.NOT_FOUND);
      }

      try {
        const existing = await deps.repository.findById(cvId);
        const ownership = checkCvOwnership(existing, authResult.user.id);
        if (!ownership.ok) {
          return cvError(
            ownership.code,
            CV_ERROR_MESSAGES[ownership.code],
          );
        }

        const deleted = await deps.repository.deleteOwned(
          cvId,
          authResult.user.id,
        );

        if (!deleted) {
          return cvError(CV_ERROR_CODES.NOT_FOUND, CV_ERROR_MESSAGES.NOT_FOUND);
        }

        return { success: true, data: { id: cvId } };
      } catch {
        return handleDatabaseError();
      }
    },
  };
}

export const cvService = createCvService({
  getUser: getCurrentUser,
  repository: cvRepository,
  getAccountPhoto: (user) => fetchAccountPhotoDataUrl(user.image),
});

export type CvService = ReturnType<typeof createCvService>;
