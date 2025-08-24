
export function extractJson(text: string) {
  let t = (text || "").trim();
  if (t.startsWith("```")) {
    const firstNL = t.indexOf("\n");
    const lastFence = t.lastIndexOf("```");
    if (firstNL !== -1 && lastFence !== -1 && lastFence > firstNL) {
      t = t.slice(firstNL + 1, lastFence).trim();
    }
  }
  try { return JSON.parse(t); } catch {}
  const obj = t.match(/\{[\s\S]*\}/);
  const arr = t.match(/\[[\s\S]*\]/);
  const cand = obj ? obj[0] : (arr ? arr[0] : "");
  return JSON.parse(cand);
}
