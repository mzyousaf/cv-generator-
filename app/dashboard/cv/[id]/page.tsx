import { redirect } from "next/navigation";
import { getCvAction } from "@/lib/cv/actions";
import { CV_ERROR_CODES } from "@/lib/cv/errors";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { CvBuilder } from "@/components/cv-builder/cv-builder";
import { BuilderErrorState } from "@/components/cv-builder/builder-page-states";

type CvBuilderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CvBuilderPage({ params }: CvBuilderPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { id } = await params;
  const result = await getCvAction(id);

  if (!result.success) {
    if (result.error.code === CV_ERROR_CODES.UNAUTHENTICATED) {
      redirect(`/login?callbackUrl=/dashboard/cv/${id}`);
    }

    return <BuilderErrorState code={result.error.code} />;
  }

  return <CvBuilder cvId={result.data.id} initialCv={result.data} />;
}
