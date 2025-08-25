
import { openai } from "../src/lib/openai.js";
import { ScriptSchema } from "../src/lib/schemas.js";
import { extractJson } from "./_json.js";
import { getPromptPack } from "../src/lib/configStore.js";
import type { TemplateKey, Hook } from "../src/lib/types.prompts";

function json(d:any,s=200){return new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json"}});}

function pickHooks(hooks: Hook[], tone?: string, form?: string, limit = 5) {
  const arr = hooks.filter(h => (h.active!==false) && (!tone || h.tone===tone) && (!form || h.form===form));
  return arr.slice(0, limit).map(h => h.text);
}

export default async function handler(req: Request) {
  const { idea, strategy } = await req.json().catch(()=>({}));
  const templateKey = (idea?.template as TemplateKey) || "Story";
  const tone = strategy?.tone || "خودمونی-حرفه‌ای";
  const form = idea?.format || "reels";

  if (!process.env.OPENAI_API_KEY) {
    return json({
      id: "demo-1",
      title: idea?.title ?? "نمونه اسکریپت",
      technique: "suspense",
      format: idea?.format ?? "رِیل",
      blocks: {}, hooks: "قلاب کوتاه",
      beats: ["هوک","بدنه","نتیجه"],
      planSilent: ["کات","نمای نزدیک"],
      narration: ["جمله ۱","جمله ۲","CTA"],
      cta: "برای نتایج بیشتر فالو کن"
    });
  }

  try {
    const pack = await getPromptPack();
    const tpl = pack.templates?.[templateKey];
    const hooksArr = pack.hooks?.[templateKey] || [];
    const selectedHooks = pickHooks(hooksArr, tone, form, 5);

    const sys = [pack.globals.system, ...(pack.globals.guardrails||[]).map(g=>"- "+g), (tpl?.system||"")].join("\n");
    const usr = (tpl?.user||"")
      .replace("{{brief}}", JSON.stringify(strategy ?? {}, null, 2))
      .replace("{{idea}}", JSON.stringify(idea ?? {}, null, 2))
      .replace("{{hooks}}", JSON.stringify(selectedHooks, null, 2));

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{ role:"system", content: sys }, { role:"user", content: usr }]
    } as any);

    const outText = (resp as any).output_text ?? (resp as any)?.output?.[0]?.content?.[0]?.text ?? "";
    const data = extractJson(outText);
    const parsed = ScriptSchema.safeParse(data);
    if (!parsed.success) return json({ error:"Schema mismatch", issues:parsed.error.issues, raw:data }, 422);
    return json(parsed.data);
  } catch(e:any) { return json({ error:e?.message||"خطا"}, 500); }
}
