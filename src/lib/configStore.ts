
import fs from "node:fs/promises";
import path from "node:path";
import type { PromptPack } from "./types.prompts";

const DATA_DIR = path.join(process.cwd(), "data");
const RUNTIME_FILE = path.join(DATA_DIR, "prompts.runtime.json");
const DEFAULT_FILE = path.join(DATA_DIR, "prompts.default.json");

async function ensureDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
}

export async function getPromptPack(): Promise<PromptPack> {
  await ensureDir();
  try {
    const raw = await fs.readFile(RUNTIME_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    const raw = await fs.readFile(DEFAULT_FILE, "utf8");
    return JSON.parse(raw);
  }
}

export async function setPromptPack(updater: (prev: PromptPack) => PromptPack) {
  const prev = await getPromptPack();
  const next = updater(prev);
  await ensureDir();
  await fs.writeFile(RUNTIME_FILE, JSON.stringify(next, null, 2), "utf8");
  return next;
}
