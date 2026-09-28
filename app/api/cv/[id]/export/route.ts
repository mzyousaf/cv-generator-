import { isValidCvId } from "@/lib/cv/validation";
import {
  contentDispositionFilename,
} from "@/lib/pdf/filename";
import { cvExportService } from "@/lib/pdf/cv-export-service-instance";
import { mapExportErrorToStatusCode } from "@/lib/pdf/export-service";
import { CV_ERROR_MESSAGES } from "@/lib/cv/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidCvId(id)) {
    return Response.json(
      { message: CV_ERROR_MESSAGES.NOT_FOUND },
      { status: 404 },
    );
  }
  const result = await cvExportService.exportCvPdfById(id);

  if (!result.success) {
    return Response.json(
      { message: result.error.message },
      { status: mapExportErrorToStatusCode(result.error) },
    );
  }

  return new Response(new Uint8Array(result.data.pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": contentDispositionFilename(result.data.filename),
      "Cache-Control": "no-store",
    },
  });
}
