import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import { DirText as Text, PdfLanguage } from "@/lib/pdf/direction";
import { siteConfig } from "@/lib/constants";
import { pdfFontFamily } from "@/lib/pdf/fonts";
import { PdfBodySections } from "@/lib/pdf/sections";
import type { CvDocumentView } from "@/components/cv-templates/view-model";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    color: "#18181b",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d8",
    paddingBottom: 12,
    marginBottom: 8,
  },
  name: { fontSize: 22, fontWeight: 700 },
  title: { fontSize: 12, marginTop: 4, color: "#3f3f46" },
  contact: { fontSize: 9, marginTop: 6, color: "#3f3f46", lineHeight: 1.4 },
  sectionHeading: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d8",
    paddingBottom: 3,
    color: "#3f3f46",
  },
  entryTitle: { fontSize: 11, fontWeight: 700 },
  entryMeta: { fontSize: 10, color: "#3f3f46" },
  entryDate: { fontSize: 9, color: "#52525b" },
});

export function DefaultPdfDocument({ view }: { view: CvDocumentView }) {
  return (
    <PdfLanguage value={view.locale}>
      <Document title={view.displayName} language={view.locale} creator={siteConfig.name} producer={siteConfig.name}>
        <Page size="A4" style={[styles.page, { fontFamily: pdfFontFamily(view.locale, "sans"), textAlign: view.dir === "rtl" ? "right" : "left" }]}>
          <View style={styles.header}>
            <Text style={styles.name}>{view.displayName}</Text>
            <Text style={styles.title}>{view.displayTitle}</Text>
            {view.contactItems.length > 0 ? (
              <Text style={styles.contact}>{view.contactItems.join(" · ")}</Text>
            ) : null}
          </View>
          <PdfBodySections
            view={view}
            headingStyle={styles.sectionHeading}
            titleStyle={styles.entryTitle}
            metaStyle={styles.entryMeta}
            dateStyle={styles.entryDate}
          />
        </Page>
      </Document>
    </PdfLanguage>
  );
}
