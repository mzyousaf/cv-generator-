import Link from "next/link";

/** Visible breadcrumb trail (for the dark page hero); the matching BreadcrumbList JSON-LD is emitted by the page. */
export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="rounded hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-slate-200">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
