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
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-lg text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
