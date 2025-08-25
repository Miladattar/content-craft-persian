// api/admin/prompts.ts

import { getPromptPack, setPromptPack } from "../../src/lib/configStore.js";
import type { PromptPack } from "../../src/lib/types.prompts";

// پاسخ JSON یکدست
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ساخت base URL از هدرها تا خطای "Invalid URL" نخوریم
function getUrl(req: Request) {
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host =
    req.headers.get("host") ||
    process.env.VERCEL_URL || // مثل my-app.vercel.app
    "localhost:5173";
  return new URL(req.url, `${proto}://${host}`);
}

export default async function handler(req: Request) {
  try {
    const url = getUrl(req);
    const key = url.searchParams.get("key");

    // محافظت ساده‌ی ادمین
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
    if (!ADMIN_PASSWORD || key !== ADMIN_PASSWORD) {
      return json({ error: "unauthorized" }, 401);
    }

    if (req.method === "GET") {
      const pack = await getPromptPack();
      return json(pack, 200);
    }

    if (req.method === "POST") {
      const body = (await req.json()) as Partial<PromptPack>;
      // حداقل ولیدیشن
      if (!body) return json({ error: "invalid body" }, 400);

      const updated = await setPromptPack(body);
      return json({ ok: true, updated }, 200);
    }

    return json({ error: "method not allowed" }, 405);
  } catch (err: any) {
    return json({ error: err?.message || "internal error" }, 500);
  }
}
