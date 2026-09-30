import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        This Privacy Policy describes how {siteConfig.name} (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and stores
        information when you use our CV generation service (the
        &quot;Service&quot;). This document is provided for transparency.
        [PLACEHOLDER: have qualified legal counsel review and finalize this
        policy for your jurisdiction and business structure.]
      </p>

      <h2>Information we collect</h2>
      <p>
        We collect information you provide directly, information generated
        through your use of the Service, and limited technical data needed to
        operate the application.
      </p>

      <h2>Account information</h2>
      <p>
        When you register, we collect details such as your name, email address,
        and a hashed password (for email/password sign-in). If you use Google
        OAuth, we receive profile information made available by Google (such as
        name, email, and profile image) according to your Google account
        settings.
      </p>

      <h2>CV and resume content</h2>
      <p>
        Content you enter into the CV builder, including employment history,
        education, skills, summaries, and related fields, is stored so you can
        edit, save, and export your CVs. You control what you submit.
      </p>

      <h2>Authentication information</h2>
      <p>
        We use Auth.js (NextAuth) with JWT-based sessions. Session tokens and
        related authentication data are used to keep you signed in and to
        protect access to your account and CVs.
      </p>

      <h2>AI processing</h2>
      <p>
        When AI features are enabled and you choose to use them, relevant text
        you submit (such as summaries or experience descriptions) may be sent to
        a configured AI provider (for example, an OpenAI-compatible API) to
        generate suggestions. You must accept suggestions before they are
        applied. Do not submit sensitive personal data you do not want processed
        by third-party AI services.
      </p>

      <h2>PDF generation</h2>
      <p>
        PDF export is generated on our servers from your saved CV data and
        selected template. Export requests require authentication and ownership
        checks; we do not generate PDFs from arbitrary client-supplied content
        without those controls.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>Provide, maintain, and improve the Service</li>
        <li>Authenticate users and enforce access to CVs</li>
        <li>Save and sync your CV content</li>
        <li>Generate AI suggestions when you request them</li>
        <li>Produce PDF exports when you request them</li>
        <li>Respond to support or legal requests where applicable</li>
      </ul>

      <h2>Data storage</h2>
      <p>
        Account and CV data are stored in MongoDB (or a compatible database)
        hosted by a provider you configure for deployment (for example, MongoDB
        Atlas). Data location depends on your database hosting region and
        provider settings.
      </p>

      <h2>Third-party services</h2>
      <p>The Service may rely on third parties such as:</p>
      <ul>
        <li>Hosting (for example, Vercel)</li>
        <li>Database hosting (for example, MongoDB Atlas)</li>
        <li>Authentication (Google OAuth when enabled)</li>
        <li>AI providers (when API keys are configured)</li>
      </ul>
      <p>
        Each provider processes data according to its own terms and privacy
        policies. [PLACEHOLDER: list the specific vendors and links you use in
        production.]
      </p>

      <h2>Google OAuth</h2>
      <p>
        If you sign in with Google, Google processes your authentication
        according to Google&apos;s policies. We receive limited profile
        information to create or update your account as described above.
      </p>

      <h2>Cookies and session technologies</h2>
      <p>
        We use cookies or similar session mechanisms required for sign-in and
        security. These are essential for authenticated features rather than
        advertising tracking.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain account and CV data while your account is active and as needed
        to provide the Service. [PLACEHOLDER: define retention periods, backup
        retention, and deletion practices with legal advice.]
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard measures such as password hashing, server-side
        access controls, and ownership checks on CV operations. No method of
        transmission or storage is completely secure.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct,
        delete, or export personal data. [PLACEHOLDER: describe how users can
        exercise rights and any regional requirements after legal review. We do
        not claim compliance with GDPR, CCPA, or other regimes unless formally
        established.]
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age in
        your jurisdiction). We do not knowingly collect personal information
        from children. [PLACEHOLDER: adjust age threshold per applicable law.]
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the
        updated version on this page and update the &quot;Last updated&quot;
        date. [PLACEHOLDER: describe how you will notify users of material
        changes.]
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or requests, contact: [PLACEHOLDER: privacy
        contact email or web form]. [PLACEHOLDER: do not list a legal entity
        address until confirmed with counsel.]
      </p>
    </LegalPageLayout>
  );
}
