"use server";

import {
  cvService,
  type CreateCvPayload,
  type UpdateCvPayload,
} from "@/lib/cv/service";
import type { CvResult } from "@/lib/cv/errors";
import type { CvRecord } from "@/lib/cv/serialize";

export async function createCvAction(
  input: CreateCvPayload,
): Promise<CvResult<CvRecord>> {
  return cvService.createCv(input);
}

export async function listCvsAction(): Promise<CvResult<CvRecord[]>> {
  return cvService.listCvsForCurrentUser();
}

export async function getCvAction(cvId: string): Promise<CvResult<CvRecord>> {
  return cvService.getCvForCurrentUser(cvId);
}

export async function updateCvAction(
  cvId: string,
  input: UpdateCvPayload,
): Promise<CvResult<CvRecord>> {
  return cvService.updateCvForCurrentUser(cvId, input);
}

export async function deleteCvAction(
  cvId: string,
): Promise<CvResult<{ id: string }>> {
  return cvService.deleteCvForCurrentUser(cvId);
}
