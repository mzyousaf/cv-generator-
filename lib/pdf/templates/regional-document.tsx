import { siteConfig } from "@/lib/constants";
import { Document, Image, Page, View } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import {
  buildRegionalDocumentModel,
  type DocBlock,
  type DocItem,
  type DocPair,
  type DocSection,
  type RegionalDocumentModel,
} from "@/lib/cv/document-model";
import { bandTitleColor, type RegionalTemplateSpec } from "@/lib/cv/template-catalog";
import { DirText as Text, pdfDir } from "@/lib/pdf/direction";
import { pdfFontFamily } from "@/lib/pdf/fonts";

type Tone = "page" | "side";

const MUTED = "#52525b";
const INK = "#18181b";

function caps(model: RegionalDocumentModel, spacing: number): Style {
  return model.script === "latin"
    ? { textTransform: "uppercase", letterSpacing: spacing }
    : {};
}

function Heading({ title, model, tone = "page" }: { title: string; model: RegionalDocumentModel; tone?: Tone }) {
  const { spec } = model;
  const { rtl } = pdfDir(model.dir);
  const side = tone === "side";
  const base: Style = { fontSize: 9, fontWeight: 700, marginBottom: 6, ...caps(model, 0.8) };

  switch (spec.heading) {
    case "block":
      return (
        <View style={{ backgroundColor: side ? "#ffffff22" : spec.accent, paddingVertical: 3, paddingHorizontal: 8, marginBottom: 6 }}>
          <Text style={{ ...base, marginBottom: 0, color: "#ffffff" }}>{title}</Text>
        </View>
      );
    case "bar":
      return (
        <View
          style={{
            [rtl ? "borderRightWidth" : "borderLeftWidth"]: 3,
            [rtl ? "borderRightColor" : "borderLeftColor"]: spec.accent,
            [rtl ? "paddingRight" : "paddingLeft"]: 6,
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 700, color: side ? "#ffffff" : INK }}>{title}</Text>
        </View>
      );
    case "accent-rule":
      return (
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: side ? "#ffffff66" : spec.accent, paddingBottom: 2, marginBottom: 6 }}>
          <Text style={{ ...base, marginBottom: 0, color: side ? "#ffffff" : spec.accent }}>{title}</Text>
        </View>
      );
    case "caps":
      return <Text style={{ ...base, fontSize: 8.5, ...caps(model, 1.6), color: spec.accent }}>{title}</Text>;
    case "rule":
    default:
      return (
        <View style={{ borderBottomWidth: 0.75, borderBottomColor: side ? "#ffffff55" : "#a1a1aa", paddingBottom: 2, marginBottom: 6 }}>
          <Text style={{ ...base, marginBottom: 0, color: side ? "#ffffff" : INK }}>{title}</Text>
        </View>
      );
  }
}

function Item({ item, dir, tone = "page", datesInline = false }: { item: DocItem; dir: "ltr" | "rtl"; tone?: Tone; datesInline?: boolean }) {
  const { row } = pdfDir(dir);
  const muted = tone === "side" ? "#ffffffbb" : MUTED;
  const strong = tone === "side" ? "#ffffff" : INK;
  const meta = [item.subtitle, datesInline ? item.dates : ""].filter(Boolean).join(" · ");
  return (
    <View style={{ marginBottom: 7 }} wrap={false}>
      <View style={{ flexDirection: row, justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: 700, color: strong }}>{item.title}</Text>
        </View>
        {item.dates && !datesInline ? (
          <Text style={{ fontSize: 8.5, color: muted, [dir === "rtl" ? "paddingRight" : "paddingLeft"]: 8 }}>{item.dates}</Text>
        ) : null}
      </View>
      {meta ? <Text style={{ fontSize: 8.75, color: muted, marginTop: 1 }}>{meta}</Text> : null}
      {item.body ? (
        <Text style={{ fontSize: 9, color: tone === "side" ? "#ffffff" : "#27272a", marginTop: 2, lineHeight: 1.45 }}>{item.body}</Text>
      ) : null}
    </View>
  );
}

function Pairs({ pairs, dir, tone = "page" }: { pairs: DocPair[]; dir: "ltr" | "rtl"; tone?: Tone }) {
  const { row } = pdfDir(dir);
  return (
    <View>
      {pairs.map((pair) => (
        <View key={pair.label} style={{ flexDirection: row, justifyContent: "space-between", marginBottom: 2 }}>
          <Text style={{ fontSize: 9, fontWeight: 700, color: tone === "side" ? "#ffffff" : INK }}>{pair.label}</Text>
          <Text style={{ fontSize: 9, color: tone === "side" ? "#ffffffbb" : MUTED }}>{pair.value}</Text>
        </View>
      ))}
    </View>
  );
}

function Block({ block, model, tone = "page", timeline = false }: { block: DocBlock; model: RegionalDocumentModel; tone?: Tone; timeline?: boolean }) {
  const { row } = pdfDir(model.dir);
  const color = tone === "side" ? "#ffffff" : "#27272a";
  switch (block.kind) {
    case "text":
      return <Text style={{ fontSize: 9, lineHeight: 1.5, color }}>{block.text}</Text>;
    case "tags":
      return tone === "side" ? (
        <View style={{ flexDirection: row, flexWrap: "wrap" }}>
          {block.tags.map((tag) => (
            <Text key={tag} style={{ fontSize: 8.5, color: "#ffffff", backgroundColor: "#ffffff22", paddingVertical: 1.5, paddingHorizontal: 5, marginBottom: 4, marginRight: 4, borderRadius: 3 }}>
              {tag}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 9, lineHeight: 1.5, color }}>{block.tags.join(" · ")}</Text>
      );
    case "pairs":
      return <Pairs pairs={block.pairs} dir={model.dir} tone={tone} />;
    case "items":
      if (timeline) {
        return (
          <View>
            {block.items.map((item, index) => (
              <View key={index} style={{ flexDirection: row, marginBottom: 2 }} wrap={false}>
                <Text style={{ width: "26%", fontSize: 8.75, color: model.spec.accent, fontWeight: 700 }}>{item.dates}</Text>
                <View style={{ flex: 1 }}>
                  <Item item={{ ...item, dates: "" }} dir={model.dir} />
                </View>
              </View>
            ))}
          </View>
        );
      }
      return (
        <View>
          {block.items.map((item, index) => (
            <Item key={index} item={item} dir={model.dir} tone={tone} datesInline={tone === "side"} />
          ))}
        </View>
      );
  }
}

function Sections({ sections, model, timeline = false }: { sections: DocSection[]; model: RegionalDocumentModel; timeline?: boolean }) {
  return (
    <View>
      {sections.map((section) => (
        <View key={section.key} style={{ marginBottom: model.spec.compact ? 8 : 12 }}>
          <Heading title={section.title} model={model} />
          <Block block={section.block} model={model} timeline={timeline} />
        </View>
      ))}
    </View>
  );
}

function Footer({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const { row } = pdfDir(model.dir);
  if (!spec.signature && !spec.referencesNote) {
    return null;
  }
  return (
    <View style={{ marginTop: 18 }} wrap={false}>
      {spec.referencesNote ? <Text style={{ fontSize: 8.75, color: MUTED }}>{labels.referencesOnRequest}</Text> : null}
      {spec.signature ? (
        <View style={{ flexDirection: row, justifyContent: "space-between", marginTop: 30 }}>
          {[labels.placeDate, labels.signature].map((label) => (
            <View key={label} style={{ width: "42%", borderTopWidth: 0.75, borderTopColor: "#a1a1aa", paddingTop: 3 }}>
              <Text style={{ fontSize: 8, color: MUTED }}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function Photo({ src, size = 70, round = false, ring }: { src: string; size?: number; round?: boolean; ring?: string }) {
  const height = round ? size : Math.round(size * 1.25);
  return (
    // react-pdf Image is not an HTML <img>; it has no alt attribute.
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      src={src}
      style={{
        width: size,
        height,
        objectFit: "cover",
        borderRadius: round ? size / 2 : 4,
        borderWidth: ring ? 2 : 0.5,
        borderColor: ring ?? "#e4e4e7",
      }}
    />
  );
}

function Header({ model, withContacts = true }: { model: RegionalDocumentModel; withContacts?: boolean }) {
  const { spec } = model;
  const { rtl, row } = pdfDir(model.dir);
  const band = spec.headerBand;
  const align: Style["textAlign"] = spec.headerAlign === "center" ? "center" : rtl ? "right" : "left";
  const details = spec.layout === "single" && model.details.length
    ? model.details.map((pair) => `${pair.label}: ${pair.value}`).join("  ·  ")
    : "";
  return (
    <View
      style={
        band
          ? { backgroundColor: band, paddingVertical: 22, paddingHorizontal: 36, marginTop: -30, marginHorizontal: -36, marginBottom: 16, borderBottomWidth: 3, borderBottomColor: spec.accent }
          : { marginBottom: 14 }
      }
    >
      <View style={{ flexDirection: row, alignItems: "center" }}>
      <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 700, color: band ? "#ffffff" : INK, textAlign: align }}>{model.name}</Text>
      <Text style={{ fontSize: 11, fontWeight: 700, color: band ? bandTitleColor(spec.accent) : spec.accent, marginTop: 3, textAlign: align }}>{model.title}</Text>
      {withContacts && model.contacts.length ? (
        <Text style={{ fontSize: 8.5, color: band ? "#ffffffcc" : MUTED, marginTop: 6, textAlign: align }}>
          {model.contacts.map((pair) => pair.value).join("  ·  ")}
        </Text>
      ) : null}
      {details ? (
        <Text style={{ fontSize: 8.5, color: band ? "#ffffffcc" : MUTED, marginTop: 2, textAlign: align }}>{details}</Text>
      ) : null}
      </View>
      {model.photo ? (
        <View style={rtl ? { marginRight: 16 } : { marginLeft: 16 }}>
          <Photo src={model.photo} size={band ? 62 : 68} ring={band ? "#ffffffdd" : undefined} />
        </View>
      ) : null}
      </View>
    </View>
  );
}

function LabeledRows({ pairs, model }: { pairs: DocPair[]; model: RegionalDocumentModel }) {
  const { row } = pdfDir(model.dir);
  return (
    <View>
      {pairs.map((pair) => (
        <View key={pair.label} style={{ flexDirection: row, marginBottom: 2 }}>
          <Text style={{ width: "26%", fontSize: 9, color: MUTED }}>{pair.label}</Text>
          <Text style={{ flex: 1, fontSize: 9, color: INK }}>{pair.value}</Text>
        </View>
      ))}
    </View>
  );
}

function SingleBody({ model }: { model: RegionalDocumentModel }) {
  return (
    <>
      <Header model={model} />
      <Sections sections={model.sections} model={model} />
      <Footer model={model} />
    </>
  );
}

function TimelineBody({ model }: { model: RegionalDocumentModel }) {
  const personal = [...model.contacts, ...model.details];
  return (
    <>
      <Header model={model} withContacts={false} />
      {personal.length ? (
        <View style={{ marginBottom: 12 }}>
          <Heading title={model.labels.personalDetails} model={model} />
          <LabeledRows pairs={personal} model={model} />
        </View>
      ) : null}
      <Sections sections={model.sections} model={model} timeline />
      <Footer model={model} />
    </>
  );
}

function EuropassBody({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const { row, rtl } = pdfDir(model.dir);
  const labelStyle: Style = { width: "30%", fontSize: 8, color: spec.accent, fontWeight: 700, textAlign: rtl ? "left" : "right", ...caps(model, 0.6) };
  const gap: Style = rtl ? { marginLeft: 14 } : { marginRight: 14 };
  const personal = [...model.contacts, ...model.details];
  const headingRow = (title: string) => (
    <View style={{ flexDirection: row, alignItems: "center", marginBottom: 5 }}>
      <Text style={[labelStyle, gap]}>{title}</Text>
      <View style={{ flex: 1, height: 1.5, backgroundColor: spec.accent }} />
    </View>
  );
  return (
    <>
      <View style={{ flexDirection: row, alignItems: "flex-end", marginBottom: 14 }}>
        <View style={[{ width: "30%", alignItems: rtl ? "flex-start" : "flex-end" }, gap]}>
          {model.photo ? (
            <View style={{ marginBottom: 6 }}>
              <Photo src={model.photo} size={62} />
            </View>
          ) : null}
          <Text style={[labelStyle, { width: "100%", fontSize: 7.5 }]}>{labels.curriculumVitae}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 21, fontWeight: 700, color: INK }}>{model.name}</Text>
          <Text style={{ fontSize: 10.5, fontWeight: 700, color: spec.accent, marginTop: 2 }}>{model.title}</Text>
        </View>
      </View>
      {personal.length ? (
        <View style={{ marginBottom: 10 }}>
          {headingRow(labels.personalDetails)}
          {personal.map((pair) => (
            <View key={pair.label} style={{ flexDirection: row, marginBottom: 2 }}>
              <Text style={[labelStyle, gap, { color: MUTED, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 8.5 }]}>{pair.label}</Text>
              <Text style={{ flex: 1, fontSize: 9 }}>{pair.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {model.sections.map((section) => (
        <View key={section.key} style={{ marginBottom: 10 }}>
          {headingRow(section.title)}
          {section.block.kind === "items" ? (
            section.block.items.map((item, index) => (
              <View key={index} style={{ flexDirection: row }} wrap={false}>
                <Text style={[labelStyle, gap, { color: MUTED, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 8.5 }]}>{item.dates}</Text>
                <View style={{ flex: 1 }}>
                  <Item item={{ ...item, dates: "" }} dir={model.dir} />
                </View>
              </View>
            ))
          ) : (
            <View style={{ flexDirection: row }}>
              <View style={[{ width: "30%" }, gap]} />
              <View style={{ flex: 1 }}>
                <Block block={section.block} model={model} />
              </View>
            </View>
          )}
        </View>
      ))}
      <Footer model={model} />
    </>
  );
}

function SidebarBody({ model }: { model: RegionalDocumentModel }) {
  const { spec, labels } = model;
  const { row } = pdfDir(model.dir);
  const side = model.sections.filter((section) => section.placement === "side");
  const main = model.sections.filter((section) => section.placement === "main");
  const sideList = (pairs: DocPair[]) => (
    <View>
      {pairs.map((pair) => (
        <View key={pair.label} style={{ marginBottom: 5 }}>
          <Text style={{ fontSize: 7, color: "#ffffff99", ...caps(model, 0.6) }}>{pair.label}</Text>
          <Text style={{ fontSize: 8.75, color: "#ffffff" }}>{pair.value}</Text>
        </View>
      ))}
    </View>
  );
  return (
    <View style={{ flexDirection: row, flexGrow: 1 }}>
      <View style={{ width: "33%", backgroundColor: spec.sidebarColor, paddingVertical: 30, paddingHorizontal: 18 }}>
        {model.photo ? (
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Photo src={model.photo} size={88} round ring={spec.accent} />
          </View>
        ) : null}
        {model.contacts.length ? (
          <View style={{ marginBottom: 14 }}>
            <Heading title={labels.contact} model={model} tone="side" />
            {sideList(model.contacts)}
          </View>
        ) : null}
        {model.details.length ? (
          <View style={{ marginBottom: 14 }}>
            <Heading title={labels.personalDetails} model={model} tone="side" />
            {sideList(model.details)}
          </View>
        ) : null}
        {side.map((section) => (
          <View key={section.key} style={{ marginBottom: 14 }}>
            <Heading title={section.title} model={model} tone="side" />
            <Block block={section.block} model={model} tone="side" />
          </View>
        ))}
      </View>
      <View style={{ flex: 1, paddingVertical: 30, paddingHorizontal: 26 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: 700, color: INK }}>{model.name}</Text>
          <Text style={{ fontSize: 11, fontWeight: 700, color: spec.accent, marginTop: 3 }}>{model.title}</Text>
        </View>
        <Sections sections={main} model={model} />
        <Footer model={model} />
      </View>
    </View>
  );
}

export function RegionalPdfDocument({ view, spec }: { view: CvDocumentView; spec: RegionalTemplateSpec }) {
  const model = buildRegionalDocumentModel(view, spec);
  const sidebar = spec.layout === "sidebar";
  const page: Style = {
    fontFamily: pdfFontFamily(view.locale, spec.font),
    textAlign: view.dir === "rtl" ? "right" : "left",
    fontSize: 9,
    color: INK,
    paddingVertical: sidebar ? 0 : spec.compact ? 26 : 30,
    paddingHorizontal: sidebar ? 0 : spec.compact ? 32 : 36,
    flexDirection: "column",
  };
  let body;
  switch (spec.layout) {
    case "sidebar":
      body = <SidebarBody model={model} />;
      break;
    case "europass":
      body = <EuropassBody model={model} />;
      break;
    case "timeline":
      body = <TimelineBody model={model} />;
      break;
    default:
      body = <SingleBody model={model} />;
  }
  return (
    <Document title={view.displayName} language={view.locale} creator={siteConfig.name} producer={siteConfig.name}>
      <Page size={spec.pageSize} style={page}>
        {body}
      </Page>
    </Document>
  );
}
