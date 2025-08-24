
export type TemplateKey =
  | "Idea120" | "PainDiscovery-edu" | "PainDiscovery-service" | "PainDiscovery-product"
  | "Story" | "Limit" | "Contrast" | "WrongRight" | "ProNovice" | "Warning"
  | "NoWords" | "Suspense" | "Review" | "Empathy" | "Choice" | "Compare"
  | "Fortune" | "ToDo" | "VisualExample";

export type Hook = {
  id: string;
  text: string;
  tone?: "خودمونی-حرفه‌ای" | "رسمی" | "خودمونی";
  form?: "reels" | "story" | "post" | "live";
  lang?: "fa";
  tags?: string[];
  active?: boolean;
};

export type PromptTemplate = {
  system: string;
  user: string;
  notes?: string;
};

export type PromptPack = {
  version: number;
  updatedAt: string;
  globals: { system: string; guardrails: string[] };
  templates: Partial<Record<TemplateKey, PromptTemplate>>;
  hooks: Record<TemplateKey, Hook[]>;
};
