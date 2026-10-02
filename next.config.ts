import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  serverExternalPackages: ["@react-pdf/renderer", "pdf-parse", "mammoth"],
  // Bundled PDF fonts are read from disk at runtime by the export route.
  outputFileTracingIncludes: {
    "/api/cv/[id]/export": ["./lib/pdf/fonts/**/*"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
