// Brief Form Types
export type CampaignGoal = 'sales' | 'awareness' | 'leads';
export type PageType = 'educational' | 'service' | 'product';
export type ToneType = 'friendly-professional' | 'formal' | 'friendly';

export interface BriefData {
  goal: CampaignGoal;
  industry: string;
  pageType: PageType;
  audience: string;
  tone: ToneType;
  guardrails: string[];
  weeklyCapacity: number;
}

// Strategy Snapshot Types
export interface StrategySnapshot {
  goal: CampaignGoal;
  pillars: string[];
  funnel: {
    awareness: number;
    consideration: number;
    action: number;
  };
  mix_weekly: {
    reels: number;
    stories: number;
    posts: number;
  };
  tone: string;
  guardrails: string[];
}

// Template Types
export interface TemplateInfo {
  id: string;
  title: string;
  description: string;
  category: 'educational' | 'service' | 'product' | 'universal';
}

// Template Output Schemas
export interface Idea120 {
  items: { n: number; title: string; format?: string }[];
  assumptions?: string;
  buckets?: { name: string; count: number }[];
}

export interface Story {
  hook: string;
  story: string;
  cta: string;
}

export interface Limit {
  script: string;
}

export interface Contrast {
  script: string;
}

export interface WrongRight {
  wrong_vo: string;
  wrong_plan: string;
  wrong_hook: string;
  right_vo: string;
  right_plan: string;
  right_hook: string;
}

export interface ProNovice {
  script: string;
}

export interface Warning {
  script: string;
}

export interface NoWords {
  ideas: {
    shock: 'mild' | 'medium' | 'hard';
    visual: string;
    message: string;
    how: string;
  }[];
  hooks: string[];
}

export interface Suspense {
  beats: { id: number; text: string }[];
  script: string;
}

export interface Review {
  script: string;
}

export interface Empathy {
  script: string;
}

export interface Choice {
  script: string;
}

export interface Compare {
  script: string;
  criteria?: string[];
}

export interface Fortune {
  checks: {
    sign: string;
    scene: string;
    meaning: string;
    instant_test: string;
  }[];
  summary: string;
}

export interface ToDo {
  goal: string;
  step1: any;
  step2?: any;
  step3?: any;
  closing: string;
}

export interface VisualExample {
  script: string;
  tools?: string[];
}

// Pain Discovery variants
export interface PainDiscovery {
  ideas?: string[];
  script?: string;
}

// Union type for all template outputs
export type TemplateOutput = 
  | Idea120 
  | Story 
  | Limit 
  | Contrast 
  | WrongRight 
  | ProNovice 
  | Warning 
  | NoWords 
  | Suspense 
  | Review 
  | Empathy 
  | Choice 
  | Compare 
  | Fortune 
  | ToDo 
  | VisualExample 
  | PainDiscovery;

// Template Form Data Types
export interface TemplateFormData {
  template: string;
  [key: string]: any;
}

// API Request/Response Types
export interface ScriptRequest {
  idea: TemplateFormData;
  strategy: BriefData | StrategySnapshot;
}

export interface BacklogRequest {
  strategy: BriefData | StrategySnapshot;
}

// UI State Types
export interface AppState {
  currentStep: 'start' | 'brief' | 'choice' | 'template' | 'output';
  brief?: BriefData;
  snapshot?: StrategySnapshot;
  selectedTemplate?: string;
  output?: TemplateOutput;
  isLoading: boolean;
  error?: string;
}

// Output View Types
export type OutputTab = 'reels' | 'story' | 'post' | 'live';

export interface OutputViewProps {
  output: TemplateOutput;
  template: string;
  brief: BriefData | StrategySnapshot;
  onEdit: () => void;
}

// Template List
export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'Idea120',
    title: '۱۲۰ ایده محتوا',
    description: 'تولید ۱۲۰ ایده منحصربه‌فرد برای محتوای شما',
    category: 'universal'
  },
  {
    id: 'PainDiscovery-edu',
    title: 'کشف دردآموزشی',
    description: 'شناسایی نیازهای آموزشی مخاطبان',
    category: 'educational'
  },
  {
    id: 'PainDiscovery-service',
    title: 'کشف درد خدماتی',
    description: 'شناسایی چالش‌های خدماتی مشتریان',
    category: 'service'
  },
  {
    id: 'PainDiscovery-product',
    title: 'کشف درد محصولی',
    description: 'شناسایی نیازهای محصولی کاربران',
    category: 'product'
  },
  {
    id: 'Story',
    title: 'روایت',
    description: 'ساخت داستان جذاب و قابل ارتباط',
    category: 'universal'
  },
  {
    id: 'Limit',
    title: 'محدودیت',
    description: 'ایجاد حس فوریت و محدودیت زمانی',
    category: 'universal'
  },
  {
    id: 'Contrast',
    title: 'تضاد',
    description: 'نمایش تضاد بین باور و واقعیت',
    category: 'universal'
  },
  {
    id: 'WrongRight',
    title: 'غلط/درست',
    description: 'مقایسه روش غلط و درست انجام کار',
    category: 'universal'
  },
  {
    id: 'ProNovice',
    title: 'مبتدی/حرفه‌ای',
    description: 'تفاوت رفتار مبتدی و حرفه‌ای',
    category: 'universal'
  },
  {
    id: 'Warning',
    title: 'هشدار',
    description: 'هشدار درباره اشتباهات رایج',
    category: 'universal'
  },
  {
    id: 'NoWords',
    title: 'بدون کلام',
    description: 'محتوای تصویری بدون نیاز به توضیح',
    category: 'universal'
  },
  {
    id: 'Suspense',
    title: 'تعلیق',
    description: 'ایجاد کنجکاوی و تعلیق وایرال',
    category: 'universal'
  },
  {
    id: 'Review',
    title: 'نقد و بررسی',
    description: 'نقد صادقانه محصول یا خدمت',
    category: 'universal'
  },
  {
    id: 'Empathy',
    title: 'همذات‌پنداری',
    description: 'ایجاد ارتباط عاطفی با مخاطب',
    category: 'universal'
  },
  {
    id: 'Choice',
    title: 'دو راهی',
    description: 'ارائه دو گزینه برای تصمیم‌گیری',
    category: 'universal'
  },
  {
    id: 'Compare',
    title: 'مقایسه',
    description: 'مقایسه دو گزینه بر اساس معیارها',
    category: 'universal'
  },
  {
    id: 'Fortune',
    title: 'فال‌گیری',
    description: 'پیش‌بینی بر اساس نشانه‌ها',
    category: 'universal'
  },
  {
    id: 'ToDo',
    title: 'چک‌لیست',
    description: 'راهنمای گام به گام عملی',
    category: 'universal'
  },
  {
    id: 'VisualExample',
    title: 'مثال تصویری',
    description: 'آموزش از طریق مثال قابل نمایش',
    category: 'universal'
  }
];