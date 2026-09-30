import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ResumesWorkspace } from "@/components/dashboard/resumes-workspace";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { listCvsAction } from "@/lib/cv/actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const cvListResult = await listCvsAction();
  const resumes = cvListResult.success ? cvListResult.data : [];

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
      }}
    >
      <ResumesWorkspace
        resumes={resumes}
        listError={
          cvListResult.success ? null : cvListResult.error.message
        }
      />
    </DashboardShell>
  );
}
