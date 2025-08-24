export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public issues?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function postJSON<T>(url: string, data: any): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          'خروجی با قالب سازگار نیست',
          422,
          errorData.issues || []
        );
      }
      
      if (response.status >= 500) {
        throw new ApiError('خطا در ارتباط با مدل', response.status);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'خطای نامشخص',
        response.status
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError('خطا در ارتباط با سرور', 0);
  }
}

export async function getJSON<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError('خطا در دریافت اطلاعات', response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('خطا در ارتباط با سرور', 0);
  }
}

// Helper for handling API errors in components
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'خطای نامشخص رخ داده است';
}

// Mock API functions for development
export const mockApi = {
  async strategy(brief: any) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      goal: brief.goal || "sales",
      pillars: [
        "آموزش و دانش‌افزایی",
        "تجربیات مشتریان",
        "پشت صحنه کسب‌وکار",
        "نوآوری و ترندها",
        "ارتباط با مخاطب"
      ],
      funnel: {
        awareness: 60,
        consideration: 30,
        action: 10
      },
      mix_weekly: {
        reels: 4,
        stories: 8,
        posts: 3
      },
      tone: brief.tone || "خودمونی-حرفه‌ای",
      guardrails: brief.guardrails || []
    };
  },

  async script(data: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const templateName = data.idea.template;
    
    // Return mock data based on template
    switch (templateName) {
      case 'Story':
        return {
          hook: "یادتونه اولین بار که...",
          story: "داستان جذاب و قابل ارتباط که نشان می‌دهد چطور از چالش به فرصت رسیدیم. این داستان باید واقعی و صادقانه باشد تا مخاطب بتواند خودش را در آن ببیند.",
          cta: "تو هم همین تجربه رو داشتی؟ بگو ببینیم"
        };
      
      case 'Limit':
        return {
          script: "فقط ۲۴ ساعت وقت داری! اگه الان شروع نکنی، یک سال دیگه همین حرف‌ها رو می‌زنی. این محدودیت واقعی نیست، بلکه فرصتی است که نمی‌تونی از دست بدی."
        };
        
      case 'Contrast':
        return {
          script: "همه فکر می‌کنن که باید زیاد کار کنن تا موفق بشن، اما واقعیت اینه که باید هوشمندانه کار کنی. تفاوت اینجاست که موفق‌ها روی سیستم‌سازی تمرکز می‌کنن، نه روی کار بیشتر."
        };
        
      default:
        return {
          script: "محتوای تولید شده برای قالب " + templateName
        };
    }
  },

  async backlog(data: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      items: Array.from({ length: 120 }, (_, i) => ({
        n: i + 1,
        title: `ایده شماره ${i + 1} برای محتوای شما`,
        format: Math.random() > 0.5 ? "[ریلز]" : "[پست]"
      })),
      assumptions: "فرضیات بر اساس بریف شما",
      buckets: [
        { name: "دانستنی‌ها", count: 15 },
        { name: "نکات کاربردی", count: 12 },
        { name: "تجربیات واقعی", count: 10 },
        { name: "اشتباهات رایج", count: 8 }
      ]
    };
  }
};