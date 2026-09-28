import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms & Conditions | ${siteConfig.name}`,
  description: `Terms and Conditions for ${siteConfig.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to
        and use of {siteConfig.name} (the &quot;Service&quot;). By using the
        Service, you agree to these Terms. [PLACEHOLDER — have qualified legal
        counsel review and finalize these Terms for your business and
        jurisdiction.]
      </p>

      <h2>Acceptance of terms</h2>
      <p>
        If you do not agree to these Terms, do not use the Service. We may
        update these Terms; continued use after changes constitutes acceptance
        of the updated Terms where permitted by law.
      </p>

      <h2>Account creation</h2>
      <p>
        You must provide accurate registration information and keep your
        credentials secure. You are responsible for activity under your account.
        You must be old enough to form a binding contract in your jurisdiction.
      </p>

      <h2>User responsibilities</h2>
      <ul>
        <li>Use the Service lawfully and in good faith</li>
        <li>Ensure CV content you submit is accurate to the best of your knowledge</li>
        <li>Do not attempt to access other users&apos; CVs or accounts</li>
        <li>Do not disrupt or reverse engineer the Service</li>
      </ul>

      <h2>CV content ownership</h2>
      <p>
        You retain ownership of the CV content you create. You grant us a
        limited license to host, process, and display your content solely to
        operate the Service (including saving, rendering templates, AI assist
        when requested, and PDF export).
      </p>

      <h2>Acceptable use</h2>
      <p>
        You may not use the Service to upload unlawful, infringing, harassing,
        or malicious content, or to misrepresent qualifications in a way that
        violates applicable law or professional obligations.
      </p>

      <h2>AI-generated content limitations</h2>
      <p>
        AI suggestions are provided for convenience. They may be inaccurate or
        incomplete. You are responsible for reviewing and editing any AI output
        before using it in applications or submissions. We do not guarantee
        hiring outcomes or employer acceptance of AI-assisted text.
      </p>

      <h2>PDF and export functionality</h2>
      <p>
        PDF exports reflect your saved CV at the time of export. Layout may
        differ slightly from on-screen previews. You are responsible for
        verifying the exported document before sharing it.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Service, including software, templates, branding, and documentation
        (excluding your CV content), is owned by us or our licensors and
        protected by applicable intellectual property laws. [PLACEHOLDER —
        specify ownership entity when established.]
      </p>

      <h2>Third-party services</h2>
      <p>
        The Service integrates with third parties (hosting, database, OAuth,
        AI providers). Your use of those features may be subject to third-party
        terms. We are not responsible for third-party services outside our
        reasonable control.
      </p>

      <h2>Availability</h2>
      <p>
        We strive for reliable operation but do not guarantee uninterrupted or
        error-free access. Maintenance, updates, or infrastructure issues may
        cause temporary unavailability.
      </p>

      <h2>Disclaimer</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
        WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, TO THE
        FULLEST EXTENT PERMITTED BY LAW. [PLACEHOLDER — legal review required
        for warranty disclaimers in your jurisdiction.]
      </p>

      <h2>Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE FOR
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR
        ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE
        SERVICE. [PLACEHOLDER — cap and exceptions must be set with legal
        advice.]
      </p>

      <h2>Account termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate
        access for violations of these Terms or to protect the Service.
        [PLACEHOLDER — describe data handling on termination.]
      </p>

      <h2>Changes to terms</h2>
      <p>
        We may modify these Terms. Material changes will be posted on this page
        with an updated date. [PLACEHOLDER — notification process.]
      </p>

      <h2>Governing law</h2>
      <p>
        [PLACEHOLDER — governing law and venue, e.g., &quot;These Terms are
        governed by the laws of [Jurisdiction], without regard to conflict of
        law principles.&quot; Do not specify until confirmed with counsel.]
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms: [PLACEHOLDER — contact email or support
        channel]. [PLACEHOLDER — legal entity name and registered address if
        applicable.]
      </p>
    </LegalPageLayout>
  );
}
