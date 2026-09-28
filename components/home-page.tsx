import { siteConfig } from "@/lib/constants";

export function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {siteConfig.name}
      </h1>
      <p className="mt-3 max-w-md text-center text-lg text-zinc-600 dark:text-zinc-400">
        Application scaffold is ready. CV features will be added in upcoming
        work.
      </p>
    </main>
  );
}
