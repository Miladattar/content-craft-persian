
import { openai } from "../src/lib/openai.js";
import { TopicSchema } from "../src/lib/schemas.js";
import { extractJson } from "./_json.js";
import { getPromptPack } from "../src/lib/configStore.js";

function json(d:any,s=200){return new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json"}});}

export default async function handler(req: Request) {
  const { strategy } = await req.json().catch(()=>({}));

  if (!process.env.OPENAI_API_KEY) {
    return json({
      items: Array.from({ length: 10 }).map((_, i) => ({
        title: "ایده شماره " + (i+1),
        format: ["رِیل","پست","توییت","نوشته"][i%4],
        score: 70 + (i % 20)
      }))
    });
  }

  try {
    const pack = await getPromptPack();
    const sys = [pack.globals.system, ...(pack.globals.guardrails||[]).map(g=>"- "+g), (pack.templates?.Idea120?.system||"")].join("\n");
    const usr = (pack.templates?.Idea120?.user||"")
      .replace("{{brief}}", JSON.stringify(strategy ?? {}, null, 2))
      .replace("{{hooks}}", JSON.stringify((pack.hooks?.Idea120||[]).slice(0,5).map(h=>h.text), null, 2));

    const resp = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{ role:"system", content: sys }, { role:"user", content: usr }]
    } as any);

    const outText = (resp as any).output_text ?? (resp as any)?.output?.[0]?.content?.[0]?.text ?? "";
    const data = extractJson(outText);
    const parsed = TopicSchema.safeParse(data);
    if (!parsed.success) return json({ error:"Schema mismatch", issues:parsed.error.issues, raw:data }, 422);
    return json(parsed.data);
  } catch(e:any) { return json({ error:e?.message||"خطا"}, 500); }
}
