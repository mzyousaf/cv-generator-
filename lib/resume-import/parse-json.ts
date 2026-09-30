export function extractJsonObjectFromModelText(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Empty model response.");
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end <= start) {
      throw new Error("No JSON object found.");
    }

    const slice = candidate.slice(start, end + 1);
    return JSON.parse(slice);
  }
}
