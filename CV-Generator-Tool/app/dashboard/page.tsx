import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CreateCvForm } from "@/components/cv-builder/create-cv-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { listCvsAction } from "@/lib/cv/actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const cvListResult = await listCvsAction();
  const cvs = cvListResult.success ? cvListResult.data : [];

  return (
    <main className="flex flex-1 flex-col px-6 py-16">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Signed in as {user.name} ({user.email}).
          </p>
        </div>
        <CreateCvForm />
        {!cvListResult.success ? (
          <p className="text-sm text-red-700">{cvListResult.error.message}</p>
        ) : null}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your CVs</h2>
          {cvs.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              No CVs yet. Create one to open the builder.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200 rounded-md border border-zinc-200">
              {cvs.map((cv) => (
                <li key={cv.id}>
                  <Link
                    href={`/dashboard/cv/${cv.id}`}
                    className="block px-4 py-3 hover:bg-zinc-50"
                  >
                    <p className="font-medium text-zinc-900">{cv.title}</p>
                    <p className="text-sm text-zinc-500">
                      Updated {new Date(cv.updatedAt).toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SignOutButton />
      </div>
    </main>
  );
}
