type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
          <span className="size-1.5 rounded-full bg-blue-500" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-5 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[2.75rem] sm:leading-[1.1]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-slate-500 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
