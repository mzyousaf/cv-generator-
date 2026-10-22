export const CV_ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  INVALID_INPUT: "INVALID_INPUT",
  DATABASE_ERROR: "DATABASE_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  LIMIT_REACHED: "LIMIT_REACHED",
} as const;

export type CvErrorCode =
  (typeof CV_ERROR_CODES)[keyof typeof CV_ERROR_CODES];

export type CvError = {
  code: CvErrorCode;
  message: string;
};

export type CvResult<T> =
  | { success: true; data: T }
  | { success: false; error: CvError };

export function cvError(code: CvErrorCode, message: string): CvResult<never> {
  return {
    success: false,
    error: { code, message },
  };
}

export const CV_ERROR_MESSAGES: Record<CvErrorCode, string> = {
  UNAUTHENTICATED: "You must be signed in to manage CVs.",
  NOT_FOUND: "CV not found.",
  FORBIDDEN: "You do not have access to this CV.",
  INVALID_INPUT: "Invalid CV data.",
  DATABASE_ERROR: "Something went wrong. Please try again.",
  RATE_LIMITED: "Too many requests. Please wait a few minutes and try again.",
  LIMIT_REACHED: "You have reached the maximum number of CVs. Delete one to create another.",
};
