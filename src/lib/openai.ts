
import OpenAI from "openai";
const key = (process.env.OPENAI_API_KEY ?? "").trim();
export const openai = new OpenAI({ apiKey: key || undefined });
