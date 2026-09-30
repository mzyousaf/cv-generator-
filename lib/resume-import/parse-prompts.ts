export const RESUME_IMPORT_PARSE_SYSTEM_PROMPT = `You extract structured resume data from plain text.

Rules:
- Output a single JSON object only. No markdown fences or commentary.
- Extract facts that appear in the text. Do not invent employers, dates, degrees, or skills.
- Do not rewrite, polish, or expand descriptions. Copy wording from the source when possible.
- Use empty strings for unknown string fields. Use empty arrays when a section is missing.
- For dates, copy what the resume shows (examples: "2022", "Jan 2023", "2022 to 2024"). Do not invent months or days.
- Set current to true only when the resume clearly indicates ongoing employment (Present, Current, etc.).
- Omit entries you cannot support with the provided text.

JSON shape:
{
  "personal": {
    "fullName": "",
    "professionalTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedIn": ""
  },
  "summary": "",
  "workExperience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "url": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }
  ],
  "languages": [
    {
      "language": "",
      "proficiency": ""
    }
  ]
}`;

export function buildResumeImportParseUserPrompt(extractedText: string): string {
  return `Parse the resume text below into the required JSON object.

Resume text:
"""
${extractedText}
"""`;
}
