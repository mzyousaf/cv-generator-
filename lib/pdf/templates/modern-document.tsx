import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import { DirText as Text } from "@/lib/pdf/direction";
import { siteConfig } from "@/lib/constants";
import { pdfFontFamily } from "@/lib/pdf/fonts";
import { PdfBodySections } from "@/lib/pdf/sections";
import type { CvDocumentView } from "@/components/cv-templates/view-model";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    color: "#18181b",
  },
  header: {
    backgroundColor: "#18181b",
    paddingHorizontal: 40,
    paddingVertical: 28,
    color: "#ffffff",
  },
  name: { fontSize: 24, fontWeight: 700, color: "#ffffff" },
  title: { fontSize: 13, marginTop: 6, color: "#e4e4e7" },
  contact: { fontSize: 9, marginTop: 10, color: "#d4d4d8", lineHeight: 1.4 },
  body: {
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    // Wider tracking makes PDF text extractors split headings into letters.
    letterSpacing: 1,
    color: "#71717a",
  },
  entryTitle: { fontSize: 11, fontWeight: 700 },
  entryMeta: {
    fontSize: 9,
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  entryDate: {
    fontSize: 9,
    color: "#3f3f46",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

export function ModernPdfDocument({ view }: { view: CvDocumentView }) {
  return (
    <Document title={view.displayName} language={view.locale} creator={siteConfig.name} producer={siteConfig.name}>
      <Page size="A4" style={[styles.page, { fontFamily: pdfFontFamily(view.locale, "sans"), textAlign: view.dir === "rtl" ? "right" : "left" }]}>
        <View style={styles.header}>
          <Text style={styles.name}>{view.displayName}</Text>
          <Text style={styles.title}>{view.displayTitle}</Text>
          {view.contactItems.length > 0 ? (
            <Text style={styles.contact}>{view.contactItems.join(" · ")}</Text>
          ) : null}
        </View>
        <View style={styles.body}>
          <PdfBodySections
            view={view}
            headingStyle={styles.sectionHeading}
            titleStyle={styles.entryTitle}
            metaStyle={styles.entryMeta}
            dateStyle={styles.entryDate}
          />
        </View>
      </Page>
    </Document>
  );
}
