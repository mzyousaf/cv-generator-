import type { ReactNode } from "react";
import type { Style } from "@react-pdf/types";
import { Text, View } from "@react-pdf/renderer";
import {
  formatDateRange,
  formatMonth,
} from "@/components/cv-templates/utils/format-dates";
import type { CvDocumentView } from "@/components/cv-templates/view-model";
import type { ManageableSectionId } from "@/lib/cv/section-settings";

type SectionProps = {
  title: string;
  headingStyle: Style;
  bodyStyle?: Style;
  children: ReactNode;
};

export function PdfSection({
  title,
  headingStyle,
  bodyStyle,
  children,
}: SectionProps) {
  return (
    <View style={bodyStyle ?? { marginTop: 14 }}>
      <Text style={headingStyle}>{title}</Text>
      <View style={{ marginTop: 6 }}>{children}</View>
    </View>
  );
}

export function PdfSummarySection({
  view,
  headingStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
}) {
  if (!view.summary.trim()) {
    return null;
  }

  return (
    <PdfSection title="Professional Summary" headingStyle={headingStyle}>
      <Text style={{ fontSize: 10, lineHeight: 1.45 }}>{view.summary}</Text>
    </PdfSection>
  );
}

export function PdfWorkSection({
  view,
  headingStyle,
  titleStyle,
  metaStyle,
  dateStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
  titleStyle: Style;
  metaStyle: Style;
  dateStyle: Style;
}) {
  if (view.workExperience.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Work Experience" headingStyle={headingStyle}>
      {view.workExperience.map((entry) => (
        <View key={entry.id} style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={titleStyle}>{entry.jobTitle || "Job Title"}</Text>
              <Text style={metaStyle}>
                {[entry.company, entry.location].filter(Boolean).join(" · ")}
              </Text>
            </View>
            <Text style={dateStyle}>
              {formatDateRange(entry.startDate, entry.endDate, entry.current)}
            </Text>
          </View>
          {entry.description.trim() ? (
            <Text style={{ fontSize: 10, lineHeight: 1.45, marginTop: 3 }}>
              {entry.description}
            </Text>
          ) : null}
        </View>
      ))}
    </PdfSection>
  );
}

export function PdfEducationSection({
  view,
  headingStyle,
  titleStyle,
  metaStyle,
  dateStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
  titleStyle: Style;
  metaStyle: Style;
  dateStyle: Style;
}) {
  if (view.education.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Education" headingStyle={headingStyle}>
      {view.education.map((entry) => (
        <View key={entry.id} style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={titleStyle}>{entry.degree || "Degree"}</Text>
              <Text style={metaStyle}>
                {[entry.institution, entry.location].filter(Boolean).join(" · ")}
              </Text>
            </View>
            <Text style={dateStyle}>
              {formatDateRange(entry.startDate, entry.endDate)}
            </Text>
          </View>
          {entry.description.trim() ? (
            <Text style={{ fontSize: 10, lineHeight: 1.45, marginTop: 3 }}>
              {entry.description}
            </Text>
          ) : null}
        </View>
      ))}
    </PdfSection>
  );
}

export function PdfSkillsSection({
  view,
  headingStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
}) {
  if (view.skillsList.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Skills" headingStyle={headingStyle}>
      <Text style={{ fontSize: 10, lineHeight: 1.45 }}>
        {view.skillsList.join(" · ")}
      </Text>
    </PdfSection>
  );
}

export function PdfProjectsSection({
  view,
  headingStyle,
  titleStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
  titleStyle: Style;
}) {
  if (view.projects.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Projects" headingStyle={headingStyle}>
      {view.projects.map((entry) => (
        <View key={entry.id} style={{ marginBottom: 6 }}>
          <Text style={titleStyle}>{entry.name || "Project"}</Text>
          {entry.url ? (
            <Text style={{ fontSize: 9, color: "#52525b" }}>{entry.url}</Text>
          ) : null}
          {entry.description.trim() ? (
            <Text style={{ fontSize: 10, lineHeight: 1.45, marginTop: 2 }}>
              {entry.description}
            </Text>
          ) : null}
        </View>
      ))}
    </PdfSection>
  );
}

export function PdfCertificationsSection({
  view,
  headingStyle,
  titleStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
  titleStyle: Style;
}) {
  if (view.certifications.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Certifications" headingStyle={headingStyle}>
      {view.certifications.map((entry) => (
        <View key={entry.id} style={{ marginBottom: 6 }}>
          <Text style={titleStyle}>{entry.name || "Certification"}</Text>
          <Text style={{ fontSize: 10, color: "#3f3f46" }}>
            {[entry.issuer, formatMonth(entry.date)].filter(Boolean).join(" · ")}
          </Text>
        </View>
      ))}
    </PdfSection>
  );
}

export function PdfLanguagesSection({
  view,
  headingStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
}) {
  if (view.languages.length === 0) {
    return null;
  }

  return (
    <PdfSection title="Languages" headingStyle={headingStyle}>
      {view.languages.map((entry) => (
        <View
          key={entry.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: 600 }}>
            {entry.language || "Language"}
          </Text>
          <Text style={{ fontSize: 10, color: "#3f3f46" }}>{entry.proficiency}</Text>
        </View>
      ))}
    </PdfSection>
  );
}

export function PdfCustomSections({
  view,
  headingStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
}) {
  if (view.customSections.length === 0) {
    return null;
  }

  return (
    <>
      {view.customSections.map((entry) => (
        <PdfSection
          key={entry.id}
          title={entry.title || "Custom Section"}
          headingStyle={headingStyle}
        >
          <Text style={{ fontSize: 10, lineHeight: 1.45 }}>{entry.content}</Text>
        </PdfSection>
      ))}
    </>
  );
}

function renderPdfSection(
  sectionId: ManageableSectionId,
  view: CvDocumentView,
  styles: {
    headingStyle: Style;
    titleStyle: Style;
    metaStyle: Style;
    dateStyle: Style;
  },
) {
  switch (sectionId) {
    case "summary":
      return <PdfSummarySection key={sectionId} view={view} headingStyle={styles.headingStyle} />;
    case "workExperience":
      return (
        <PdfWorkSection
          key={sectionId}
          view={view}
          headingStyle={styles.headingStyle}
          titleStyle={styles.titleStyle}
          metaStyle={styles.metaStyle}
          dateStyle={styles.dateStyle}
        />
      );
    case "education":
      return (
        <PdfEducationSection
          key={sectionId}
          view={view}
          headingStyle={styles.headingStyle}
          titleStyle={styles.titleStyle}
          metaStyle={styles.metaStyle}
          dateStyle={styles.dateStyle}
        />
      );
    case "skills":
      return <PdfSkillsSection key={sectionId} view={view} headingStyle={styles.headingStyle} />;
    case "projects":
      return (
        <PdfProjectsSection
          key={sectionId}
          view={view}
          headingStyle={styles.headingStyle}
          titleStyle={styles.titleStyle}
        />
      );
    case "certifications":
      return (
        <PdfCertificationsSection
          key={sectionId}
          view={view}
          headingStyle={styles.headingStyle}
          titleStyle={styles.titleStyle}
        />
      );
    case "languages":
      return <PdfLanguagesSection key={sectionId} view={view} headingStyle={styles.headingStyle} />;
    default:
      return null;
  }
}

export function PdfBodySections({
  view,
  headingStyle,
  titleStyle,
  metaStyle,
  dateStyle,
}: {
  view: CvDocumentView;
  headingStyle: Style;
  titleStyle: Style;
  metaStyle: Style;
  dateStyle: Style;
}) {
  const styles = { headingStyle, titleStyle, metaStyle, dateStyle };

  return (
    <>
      {view.visibleSectionOrder.map((sectionId) =>
        renderPdfSection(sectionId, view, styles),
      )}
      <PdfCustomSections view={view} headingStyle={headingStyle} />
    </>
  );
}
