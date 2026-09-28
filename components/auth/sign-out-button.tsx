import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
      >
        Sign out
      </button>
    </form>
  );
}
