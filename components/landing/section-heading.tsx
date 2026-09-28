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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 sm:text-sm">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl sm:leading-tight"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
