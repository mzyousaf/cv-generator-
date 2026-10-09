/** Output format shared by resume import and "describe yourself" creation. */
export const RESUME_JSON_SHAPE = `{
  "documentLanguage": "en",
  "personal": {
    "fullName": "",
    "professionalTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedIn": "",
    "dateOfBirth": "",
    "nationality": ""
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
    { "name": "", "description": "", "url": "" }
  ],
  "certifications": [
    { "name": "", "issuer": "", "date": "", "url": "" }
  ],
  "languages": [
    { "language": "", "proficiency": "" }
  ],
  "customSections": [
    { "title": "", "content": "" }
  ],
  "sectionOrder": []
}`;

export const RESUME_IMPORT_PARSE_SYSTEM_PROMPT = `You convert a resume/CV into structured JSON for a CV builder.

Goal: capture EVERYTHING in the document. Nothing may be lost.

Rules:
- Output a single JSON object only. No markdown fences or commentary.
- Fill the standard sections first (personal, summary, workExperience, education, skills, projects, certifications, languages).
- Any other content (awards, honors, achievements, volunteering, publications, research, patents, courses, trainings, memberships, conferences, talks, hobbies, interests, references, military service, extracurricular activities, etc.) goes into "customSections". Use the resume's own heading as the title and keep all of its text in "content".
- If text does not belong to any heading, put it in a custom section titled "Additional Information".
- Extract facts from the document only. Never invent employers, dates, degrees, numbers or skills.
- Keep the original wording. Do not polish or summarize. Keep every bullet point: put each bullet on its own line starting with "- ".
- Skills: list every individual skill, tool and technology (flatten grouped skill lists, split comma-separated lists). Do not include languages spoken here; those go in "languages".
- Dates: copy them as written (e.g. "2022", "Jan 2023", "03/2021"). Do not invent months or days.
- Set "current": true only when the role is ongoing (Present, Current, Now, heute, actuel, etc.) and leave endDate empty.
- Personal: also capture dateOfBirth and nationality if present. "location" is the city/country or address. "website" is a portfolio/personal site or GitHub; "linkedIn" is the LinkedIn URL.
- If there is no explicit summary/profile/objective section, leave summary empty.
- Use empty strings for unknown fields and empty arrays for missing sections.
- "sectionOrder" lists the sections in the order they appear in the document, using the keys "summary", "workExperience", "education", "skills", "projects", "certifications", "languages", and "custom:<index>" for customSections (0-based index into the customSections array). Only include sections that have content.
- "documentLanguage" is the language the resume is written in: one of "en", "es", "fr", "de", "ar", "zh" (use "en" for any other language).

JSON shape:
${RESUME_JSON_SHAPE}`;

export function buildResumeImportParseUserPrompt(extractedText: string): string {
  return `Convert the resume text below into the required JSON object. Capture every section and detail.

Resume text:
"""
${extractedText}
"""`;
}

export function buildResumeImportFileParseUserPrompt(): string {
  return "The attached PDF is a resume. Read all of it (including scanned or image-based pages) and convert it into the required JSON object. Capture every section and detail.";
}

export const RESUME_DESCRIPTION_SYSTEM_PROMPT = `You build a professional CV/resume from a person's own description of themselves. The description was typed or dictated by voice, so it may be informal, unordered, repetitive or contain speech-recognition mistakes.

Goal: turn everything they said into a complete, well-written CV.

Rules:
- Output a single JSON object only. No markdown fences or commentary.
- Use only facts the person stated. Never invent employers, job titles, dates, degrees, numbers, certifications or contact details. Leave unknown fields empty.
- Rewrite their words into concise, professional CV language. Work experience and project descriptions: one achievement or responsibility per line, each starting with "- ".
- Write a 2-4 sentence professional summary based on what they said (unless they gave almost no information).
- Fill the standard sections (personal, summary, workExperience, education, skills, projects, certifications, languages). Spoken languages go in "languages", not "skills".
- Skills: list each skill, tool and technology they mentioned as a separate item.
- Anything else they mentioned (awards, volunteering, hobbies, publications, courses, etc.) goes into "customSections" with a fitting title.
- Fix obvious dictation errors (e.g. "java script" -> "JavaScript"), but do not change facts.
- Dates: use what they said (e.g. "2021", "March 2022"); set "current": true for roles they still have.
- "sectionOrder" lists the sections in a sensible CV order using the keys "summary", "workExperience", "education", "skills", "projects", "certifications", "languages" and "custom:<index>". Only include sections that have content.
- "documentLanguage" is the language the description is written in: one of "en", "es", "fr", "de", "ar", "zh" (use "en" for any other language). Write the CV in that language.

JSON shape:
${RESUME_JSON_SHAPE}`;

export function buildResumeDescriptionUserPrompt(description: string): string {
  return `Build the CV JSON from this description of the person:

"""
${description}
"""`;
}
