import type { CSSProperties, ReactNode } from "react";
import { buildCvDocumentView } from "@/components/cv-templates/view-model";
import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import {
  buildRegionalDocumentModel,
  type DocBlock,
  type DocItem,
  type DocSection,
  type RegionalDocumentModel,
} from "@/lib/cv/document-model";
import { bandTitleColor, type RegionalTemplateSpec } from "@/lib/cv/template-catalog";

const FONT_STACK = {
  sans: 'var(--font-jakarta), var(--font-cyrillic), var(--font-arabic), "PingFang SC", "Microsoft YaHei", "Noto Sans SC", Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", var(--font-cyrillic), var(--font-arabic), "Songti SC", "Noto Serif SC", serif',
} as const;

/**
 * Russian CVs put the Cyrillic face first: Plus Jakarta Sans has no Cyrillic,
 * and its Arial-based fallback face would otherwise claim it before Noto Sans.
 * Other languages keep Jakarta first (next/font's Noto also declares Latin).
 */
function fontStack(font: keyof typeof FONT_STACK, locale: string): string {
  return locale === "ru" && font === "sans"
    ? `var(--font-cyrillic), ${FONT_STACK.sans}`
    : FONT_STACK[font];
}

const PAGE_SIZE = {
  A4: { width: "210mm", minHeight: "297mm" },
  LETTER: { width: "215.9mm", minHeight: "279.4mm" },
} as const;

type Tone = "page" | "side";

function Heading({
  title,
  spec,
  tone = "page",
}: {
  title: string;
  spec: RegionalTemplateSpec;
  tone?: Tone;
}) {
  const onSide = tone === "side";
  const base: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  switch (spec.heading) {
    case "block":
      return (
        <h2
          style={{
            ...base,
            background: onSide ? "rgba(255,255,255,0.12)" : spec.accent,
            color: "#fff",
            padding: "4px 10px",
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </h2>
      );
    case "bar":
      return (
        <h2
          style={{
            ...base,
            color: onSide ? "#fff" : "#18181b",
            borderInlineStart: `4px solid ${spec.accent}`,
            paddingInlineStart: 8,
            fontSize: 12,
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          {title}
        </h2>
      );
    case "accent-rule":
      return (
        <h2
          style={{
            ...base,
            color: onSide ? "#fff" : spec.accent,
            borderBottom: `2px solid ${onSide ? "rgba(255,255,255,0.35)" : spec.accent}`,
            paddingBottom: 4,
          }}
        >
          {title}
        </h2>
      );
    case "caps":
      return (
        <h2 style={{ ...base, fontSize: 10, letterSpacing: "0.12em", color: onSide ? "#ffffff" : spec.accent }}>
          {title}
        </h2>
      );
    case "rule":
    default:
      return (
        <h2
          style={{
            ...base,
            color: onSide ? "#fff" : "#18181b",
            borderBottom: `1px solid ${onSide ? "rgba(255,255,255,0.3)" : "#a1a1aa"}`,
            paddingBottom: 4,
          }}
        >
          {title}
        </h2>
      );
  }
}

function ItemRow({ item, tone = "page", datesInline = false }: { item: DocItem; tone?: Tone; datesInline?: boolean }) {
  const muted = tone === "side" ? "rgba(255,255,255,0.75)" : "#52525b";
  const strong = tone === "side" ? "#fff" : "#18181b";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: strong }}>{item.title}</h3>
        {item.dates && !datesInline ? (
          <bdi style={{ fontSize: 10, color: muted, whiteSpace: "nowrap" }}>{item.dates}</bdi>
        ) : null}
      </div>
      {item.subtitle || (datesInline && item.dates) ? (
        <p style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>
          {[item.subtitle, datesInline ? item.dates : ""].filter(Boolean).join(" · ")}
        </p>
      ) : null}
      {item.body ? (
        <p style={{ fontSize: 11, color: tone === "side" ? "#fff" : "#27272a", marginTop: 3, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {item.body}
        </p>
      ) : null}
    </div>
  );
}

function Block({
  block,
  spec,
  tone = "page",
  layout,
}: {
  block: DocBlock;
  spec: RegionalTemplateSpec;
  tone?: Tone;
  layout?: "timeline";
}) {
  const text = tone === "side" ? "#fff" : "#27272a";
  switch (block.kind) {
    case "text":
      return <p style={{ fontSize: 11, lineHeight: 1.6, color: text, whiteSpace: "pre-wrap" }}>{block.text}</p>;
    case "tags":
      return tone === "side" ? (
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {block.tags.map((tag) => (
            <li key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(255,255,255,0.12)", color: "#fff" }}>
              {tag}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 11, lineHeight: 1.6, color: text }}>{block.tags.join(" · ")}</p>
      );
    case "pairs":
      return (
        <ul style={{ display: "grid", gap: 3 }}>
          {block.pairs.map((pair) => (
            <li key={pair.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11, color: text }}>
              <span style={{ fontWeight: 600 }}>{pair.label}</span>
              <span style={{ color: tone === "side" ? "rgba(255,255,255,0.75)" : "#52525b" }}><bdi>{pair.value}</bdi></span>
            </li>
          ))}
        </ul>
      );
    case "items":
      if (layout === "timeline") {
        return (
          <div>
            {block.items.map((item, index) => (
              <div key={index} style={{ display: "grid", gridTemplateColumns: "26% 1fr", gap: 14, marginBottom: 10 }}>
                <span style={{ fontSize: 10.5, color: spec.accent, fontWeight: 600 }}>{item.dates}</span>
                <ItemRow item={{ ...item, dates: "" }} />
              </div>
            ))}
          </div>
        );
      }
      return (
        <div>
          {block.items.map((item, index) => (
            <ItemRow key={index} item={item} tone={tone} datesInline={tone === "side"} />
          ))}
        </div>
      );
  }
}

function Footer({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  if (!spec.signature && !spec.referencesNote) {
    return null;
  }
  return (
    <div style={{ marginTop: 28 }}>
      {spec.referencesNote ? (
        <p style={{ fontSize: 10.5, fontStyle: "italic", color: "#52525b" }}>{labels.referencesOnRequest}</p>
      ) : null}
      {spec.signature ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 40, marginTop: 36 }}>
          {[labels.placeDate, labels.signature].map((label) => (
            <div key={label} style={{ flex: 1, borderTop: "1px solid #a1a1aa", paddingTop: 4, fontSize: 10, color: "#52525b" }}>
              {label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Photo({ src, size = 96, round = false, ring }: { src: string; size?: number; round?: boolean; ring?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline data URL on printed paper
    <img
      src={src}
      alt=""
      width={size}
      height={round ? size : Math.round(size * 1.25)}
      style={{
        width: size,
        height: round ? size : Math.round(size * 1.25),
        objectFit: "cover",
        borderRadius: round ? "50%" : 6,
        flexShrink: 0,
        border: ring ? `3px solid ${ring}` : "1px solid #e4e4e7",
      }}
    />
  );
}

function Header({ model, compactContacts = false }: { model: RegionalDocumentModel; compactContacts?: boolean }) {
  const { spec } = model;
  const band = spec.headerBand;
  const center = spec.headerAlign === "center";
  const showDetailsInline = model.details.length > 0 && spec.layout === "single";
  return (
    <header
      style={{
        textAlign: center ? "center" : "start",
        background: band,
        color: band ? "#fff" : "#18181b",
        padding: band ? "28px 48px" : undefined,
        margin: band ? "-40px -48px 24px" : "0 0 20px",
        borderBottom: band ? `4px solid ${spec.accent}` : undefined,
        display: model.photo ? "flex" : undefined,
        alignItems: "center",
        gap: 24,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.15, color: band ? "#fff" : spec.heading === "caps" ? "#18181b" : spec.accent === "#000000" ? "#000" : "#18181b" }}>
        {model.name}
      </h1>
      <p style={{ fontSize: 14, marginTop: 4, color: band ? bandTitleColor(spec.accent) : spec.accent, fontWeight: 600 }}>{model.title}</p>
      {!compactContacts && model.contacts.length ? (
        <p style={{ fontSize: 10.5, marginTop: 8, color: band ? "rgba(255,255,255,0.8)" : "#52525b" }}>
          {model.contacts.map((pair, index) => (
            <span key={pair.label}>
              {index > 0 ? "  ·  " : null}
              <bdi>{pair.value}</bdi>
            </span>
          ))}
        </p>
      ) : null}
      {showDetailsInline ? (
        <p style={{ fontSize: 10.5, marginTop: 3, color: band ? "rgba(255,255,255,0.8)" : "#52525b" }}>
          {model.details.map((pair, index) => (
            <span key={pair.label}>
              {index > 0 ? "  ·  " : null}
              {pair.label}: <bdi>{pair.value}</bdi>
            </span>
          ))}
        </p>
      ) : null}
      </div>
      {model.photo ? <Photo src={model.photo} size={band ? 84 : 92} ring={band ? "rgba(255,255,255,0.85)" : undefined} /> : null}
    </header>
  );
}

function Sections({
  sections,
  spec,
  layout,
}: {
  sections: DocSection[];
  spec: RegionalTemplateSpec;
  layout?: "timeline";
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.key} style={{ marginBottom: spec.compact ? 12 : 18 }}>
          <Heading title={section.title} spec={spec} />
          <Block block={section.block} spec={spec} layout={layout} />
        </section>
      ))}
    </>
  );
}

function SingleLayout({ model }: { model: RegionalDocumentModel }) {
  return (
    <>
      <Header model={model} />
      <Sections sections={model.sections} spec={model.spec} />
      <Footer model={model} />
    </>
  );
}

function TimelineLayout({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const personal = [...model.contacts, ...model.details];
  return (
    <>
      <Header model={model} compactContacts />
      {personal.length ? (
        <section style={{ marginBottom: 18 }}>
          <Heading title={labels.personalDetails} spec={spec} />
          {personal.map((pair) => (
            <div key={pair.label} style={{ display: "grid", gridTemplateColumns: "26% 1fr", gap: 14, fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#52525b" }}>{pair.label}</span>
              <span><bdi>{pair.value}</bdi></span>
            </div>
          ))}
        </section>
      ) : null}
      <Sections sections={model.sections} spec={spec} layout="timeline" />
      <Footer model={model} />
    </>
  );
}

function EuropassLayout({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const label: CSSProperties = { fontSize: 10, color: spec.accent, textAlign: "end", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 };
  const row: CSSProperties = { display: "grid", gridTemplateColumns: "30% 1fr", gap: 18 };
  const personal = [...model.contacts, ...model.details];
  return (
    <>
      <header style={{ ...row, alignItems: "end", marginBottom: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          {model.photo ? <Photo src={model.photo} size={84} /> : null}
          <span style={{ ...label, fontSize: 9 }}>{labels.curriculumVitae}</span>
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#18181b" }}>{model.name}</h1>
          <p style={{ fontSize: 13, color: spec.accent, fontWeight: 600, marginTop: 2 }}>{model.title}</p>
        </div>
      </header>
      {personal.length ? (
        <section style={{ marginBottom: 16 }}>
          <div style={{ ...row, alignItems: "center", marginBottom: 6 }}>
            <span style={label}>{labels.personalDetails}</span>
            <span style={{ height: 2, background: spec.accent }} />
          </div>
          {personal.map((pair) => (
            <div key={pair.label} style={{ ...row, fontSize: 11, marginBottom: 2 }}>
              <span style={{ ...label, textTransform: "none", letterSpacing: 0, fontWeight: 400, color: "#52525b" }}>{pair.label}</span>
              <span><bdi>{pair.value}</bdi></span>
            </div>
          ))}
        </section>
      ) : null}
      {model.sections.map((section) => (
        <section key={section.key} style={{ marginBottom: 16 }}>
          <div style={{ ...row, alignItems: "center", marginBottom: 6 }}>
            <span style={label}>{section.title}</span>
            <span style={{ height: 2, background: spec.accent }} />
          </div>
          {section.block.kind === "items" ? (
            section.block.items.map((item, index) => (
              <div key={index} style={row}>
                <span style={{ ...label, textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "#52525b" }}>{item.dates}</span>
                <ItemRow item={{ ...item, dates: "" }} />
              </div>
            ))
          ) : (
            <div style={row}>
              <span />
              <Block block={section.block} spec={spec} />
            </div>
          )}
        </section>
      ))}
      <Footer model={model} />
    </>
  );
}

function SidebarLayout({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const side = model.sections.filter((section) => section.placement === "side");
  const main = model.sections.filter((section) => section.placement === "main");
  const sideList = (pairs: { label: string; value: string }[]) => (
    <ul style={{ display: "grid", gap: 6 }}>
      {pairs.map((pair) => (
        <li key={pair.label} style={{ fontSize: 10.5 }}>
          <span style={{ display: "block", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)" }}>
            {pair.label}
          </span>
          <span style={{ color: "#fff", wordBreak: "break-word" }}><bdi>{pair.value}</bdi></span>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ display: "flex", flexDirection: spec.sidebarPosition === "end" ? "row-reverse" : "row", minHeight: "inherit" }}>
      <aside style={{ width: "33%", background: spec.sidebarColor, color: "#fff", padding: "40px 24px", display: "grid", alignContent: "start", gap: 20 }}>
        {model.photo ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Photo src={model.photo} size={118} round ring={spec.accent} />
          </div>
        ) : null}
        {model.contacts.length ? (
          <section>
            <Heading title={labels.contact} spec={spec} tone="side" />
            {sideList(model.contacts)}
          </section>
        ) : null}
        {model.details.length ? (
          <section>
            <Heading title={labels.personalDetails} spec={spec} tone="side" />
            {sideList(model.details)}
          </section>
        ) : null}
        {side.map((section) => (
          <section key={section.key}>
            <Heading title={section.title} spec={spec} tone="side" />
            <Block block={section.block} spec={spec} tone="side" />
          </section>
        ))}
      </aside>
      <div style={{ flex: 1, padding: "40px 36px" }}>
        <header style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#18181b", lineHeight: 1.15 }}>{model.name}</h1>
          <p style={{ fontSize: 14, color: spec.accent, fontWeight: 600, marginTop: 4 }}>{model.title}</p>
        </header>
        <Sections sections={main} spec={spec} />
        <Footer model={model} />
      </div>
    </div>
  );
}

export function RegionalCvTemplate({
  state,
  spec,
}: {
  state: CvBuilderFormState;
  spec: RegionalTemplateSpec;
}) {
  const model = buildRegionalDocumentModel(buildCvDocumentView(state), spec);
  const size = PAGE_SIZE[spec.pageSize];
  let body: ReactNode;
  switch (spec.layout) {
    case "sidebar":
      body = <SidebarLayout model={model} />;
      break;
    case "europass":
      body = <EuropassLayout model={model} />;
      break;
    case "timeline":
      body = <TimelineLayout model={model} />;
      break;
    default:
      body = <SingleLayout model={model} />;
  }

  return (
    <article
      dir={model.dir}
      style={{
        width: size.width,
        minHeight: size.minHeight,
        maxWidth: "100%",
        margin: "0 auto",
        background: "#fff",
        color: "#18181b",
        fontFamily: fontStack(spec.font, state.documentLocale),
        // The sidebar layout draws its own full-bleed columns.
        padding: spec.layout === "sidebar" ? 0 : spec.compact ? "36px 44px" : "40px 48px",
        overflow: "hidden",
        // Long URLs or IDs wrap inside their column instead of being clipped.
        overflowWrap: "anywhere",
        boxShadow: "0 10px 30px -12px rgba(15,23,42,0.25)",
      }}
    >
      {model.isEmpty ? (
        <p style={{ fontSize: 12, fontStyle: "italic", color: "#71717a", marginBottom: 12 }}>{model.labels.emptyHint}</p>
      ) : null}
      {body}
    </article>
  );
}
