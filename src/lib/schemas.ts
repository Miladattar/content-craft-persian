
import { z } from "zod";

export const StrategySchema = z.object({
  goal: z.string(),
  pillars: z.array(z.string()),
  funnel: z.object({ awareness: z.number(), consideration: z.number(), action: z.number() }),
  mix_weekly: z.object({ reels: z.number(), stories: z.number(), posts: z.number() }),
  tone: z.string(),
  guardrails: z.array(z.string())
});

export const TopicSchema = z.object({
  items: z.array(z.object({
    n: z.number().optional(),
    title: z.string(),
    format: z.string().optional(),
    score: z.number().optional()
  }))
});

export const ScriptSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  technique: z.string().optional(),
  format: z.string().optional(),
  blocks: z.record(z.any()).optional(),
  hooks: z.string().optional(),
  beats: z.array(z.string()).optional(),
  planSilent: z.array(z.string()).optional(),
  narration: z.array(z.string()).optional(),
  cta: z.string().optional()
});
