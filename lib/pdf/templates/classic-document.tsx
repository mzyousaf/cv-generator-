import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfBodySections } from "@/lib/pdf/sections";
import type { CvDocumentView } from "@/components/cv-templates/view-model";

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 42,
    paddingHorizontal: 46,
    fontSize: 11,
    fontFamily: "Times-Roman",
    color: "#18181b",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#18181b",
    paddingBottom: 14,
    marginBottom: 10,
    alignItems: "center",
  },
  name: { fontSize: 24, fontWeight: 700, textAlign: "center" },
  title: { fontSize: 13, marginTop: 6, textAlign: "center" },
  contact: {
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
    color: "#3f3f46",
    lineHeight: 1.4,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 2,
    borderBottomColor: "#18181b",
    paddingBottom: 3,
    marginTop: 4,
  },
  entryTitle: { fontSize: 12, fontWeight: 700 },
  entryMeta: { fontSize: 11, color: "#3f3f46", fontStyle: "italic" },
  entryDate: { fontSize: 10, color: "#3f3f46", fontWeight: 700 },
});

export function ClassicPdfDocument({ view }: { view: CvDocumentView }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
  );
}
