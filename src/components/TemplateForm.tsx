import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TemplateInfo, BriefData, StrategySnapshot, TemplateFormData, TemplateOutput } from '../lib/schemas-ui';
import { postJSON, getErrorMessage, mockApi } from '../lib/fetcher';
import { buttonVariants, cardVariants, textVariants, inputVariants, formFieldVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface TemplateFormProps {
  template: TemplateInfo;
  brief: BriefData;
  snapshot?: StrategySnapshot | null;
  onSubmit: (output: TemplateOutput) => void;
}

export const TemplateForm = ({ template, brief, snapshot, onSubmit }: TemplateFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        idea: {
          template: template.id,
          ...formData
        },
        strategy: snapshot || brief
      };

      let result;
      if (template.id === 'Idea120') {
        result = await mockApi.backlog({ strategy: snapshot || brief });
      } else {
        result = await mockApi.script(requestData);
      }

      onSubmit(result);
      
      toast({
        title: "محتوا تولید شد",
        description: "خروجی شما آماده است"
      });
    } catch (error) {
      toast({
        title: "خطا در تولید محتوا",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (template.id) {
      case 'Idea120':
        return (
          <div className={formFieldVariants.wrapper}>
            <p className={textVariants.body}>
              بر اساس بریف شما، ۱۲۰ ایده محتوا تولید خواهد شد. نیازی به ورود اطلاعات اضافی نیست.
            </p>
          </div>
        );

      case 'PainDiscovery-edu':
      case 'PainDiscovery-service':
      case 'PainDiscovery-product':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>مرحله</label>
              <select
                value={formData.phase || 'before'}
                onChange={(e) => updateFormData('phase', e.target.value)}
                className={inputVariants.default}
              >
                <option value="before">قبل</option>
                <option value="during">حین</option>
                <option value="after">بعد</option>
              </select>
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>دغدغه اصلی</label>
              <input
                type="text"
                value={formData.concern || ''}
                onChange={(e) => updateFormData('concern', e.target.value)}
                placeholder="مثال: نحوه انتخاب محصول مناسب"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'Story':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>دغدغه یا موضوع داستان</label>
            <textarea
              value={formData.topic || ''}
              onChange={(e) => updateFormData('topic', e.target.value)}
              placeholder="مثال: اولین تجربه شکست و درس‌هایی که از آن گرفتم"
              rows={3}
              className={cn(inputVariants.default, "resize-none")}
            />
          </div>
        );

      case 'Limit':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>موضوع/محدودیت/باور</label>
            <input
              type="text"
              value={formData.topic || ''}
              onChange={(e) => updateFormData('topic', e.target.value)}
              placeholder="مثال: فرصت‌های شغلی در بازار فناوری"
              className={inputVariants.default}
            />
          </div>
        );

      case 'Contrast':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>باور رایج اشتباه</label>
            <input
              type="text"
              value={formData.wrongBelief || ''}
              onChange={(e) => updateFormData('wrongBelief', e.target.value)}
              placeholder="مثال: همه فکر می‌کنن که..."
              className={inputVariants.default}
            />
          </div>
        );

      case 'WrongRight':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>موضوع</label>
              <input
                type="text"
                value={formData.topic || ''}
                onChange={(e) => updateFormData('topic', e.target.value)}
                placeholder="مثال: نحوه مطالعه موثر"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>متغیر کلیدی (اختیاری)</label>
              <input
                type="text"
                value={formData.keyVariable || ''}
                onChange={(e) => updateFormData('keyVariable', e.target.value)}
                placeholder="مثال: زمان، مکان، ابزار"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'ProNovice':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>موضوع/رفتار رایج</label>
            <input
              type="text"
              value={formData.topic || ''}
              onChange={(e) => updateFormData('topic', e.target.value)}
              placeholder="مثال: نحوه ارائه در جلسات کاری"
              className={inputVariants.default}
            />
          </div>
        );

      case 'Warning':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>رفتار/اشتباه رایج</label>
            <input
              type="text"
              value={formData.mistake || ''}
              onChange={(e) => updateFormData('mistake', e.target.value)}
              placeholder="مثال: نادیده گرفتن قراردادهای کاری"
              className={inputVariants.default}
            />
          </div>
        );

      case 'NoWords':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>حوزه/مهارت</label>
              <input
                type="text"
                value={formData.topic || ''}
                onChange={(e) => updateFormData('topic', e.target.value)}
                placeholder="مثال: نحوه استفاده از ابزارهای طراحی"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>شدت شوک</label>
              <select
                value={formData.shockLevel || 'mild'}
                onChange={(e) => updateFormData('shockLevel', e.target.value)}
                className={inputVariants.default}
              >
                <option value="mild">ملایم</option>
                <option value="medium">متوسط</option>
                <option value="hard">شدید</option>
              </select>
            </div>
          </>
        );

      case 'Suspense':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>سوال/دغدغه</label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => updateFormData('question', e.target.value)}
                placeholder="مثال: راز موفقیت کسب‌وکارهای آنلاین چیست؟"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>پاسخ نهایی یک‌خطی</label>
              <input
                type="text"
                value={formData.answer || ''}
                onChange={(e) => updateFormData('answer', e.target.value)}
                placeholder="مثال: ثبات در اجرا، نه ایده‌های عالی"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'Review':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>چیزی که ری‌ویو می‌کنید</label>
              <input
                type="text"
                value={formData.item || ''}
                onChange={(e) => updateFormData('item', e.target.value)}
                placeholder="مثال: کتاب اتمی، دوره آنلاین، اپلیکیشن"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>۳ کلیدواژه تجربه واقعی</label>
              <input
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => updateFormData('keywords', e.target.value)}
                placeholder="مثال: کاربردی، زمان‌بر، نتیجه‌محور"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'Empathy':
        return (
          <div className={formFieldVariants.wrapper}>
            <label className={formFieldVariants.label}>دغدغه/وضعیت مخاطب</label>
            <textarea
              value={formData.situation || ''}
              onChange={(e) => updateFormData('situation', e.target.value)}
              placeholder="مثال: احساس گیج بودن در انتخاب مسیر شغلی"
              rows={3}
              className={cn(inputVariants.default, "resize-none")}
            />
          </div>
        );

      case 'Choice':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>سوال/دغدغه</label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => updateFormData('question', e.target.value)}
                placeholder="مثال: کدام بهتر است؟"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>گزینه A</label>
              <input
                type="text"
                value={formData.optionA || ''}
                onChange={(e) => updateFormData('optionA', e.target.value)}
                placeholder="گزینه اول"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>گزینه B</label>
              <input
                type="text"
                value={formData.optionB || ''}
                onChange={(e) => updateFormData('optionB', e.target.value)}
                placeholder="گزینه دوم"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'Compare':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>A</label>
              <input
                type="text"
                value={formData.itemA || ''}
                onChange={(e) => updateFormData('itemA', e.target.value)}
                placeholder="مورد اول"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>B</label>
              <input
                type="text"
                value={formData.itemB || ''}
                onChange={(e) => updateFormData('itemB', e.target.value)}
                placeholder="مورد دوم"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>۵ معیار مقایسه</label>
              <textarea
                value={formData.criteria || ''}
                onChange={(e) => updateFormData('criteria', e.target.value)}
                placeholder="معیار ۱، معیار ۲، معیار ۳، معیار ۴، معیار ۵"
                rows={2}
                className={cn(inputVariants.default, "resize-none")}
              />
            </div>
          </>
        );

      case 'Fortune':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>سوال/دغدغه</label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => updateFormData('question', e.target.value)}
                placeholder="مثال: آیا کسب‌وکارم موفق می‌شود؟"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>نشانه‌های رایج</label>
              <textarea
                value={formData.signs || ''}
                onChange={(e) => updateFormData('signs', e.target.value)}
                placeholder="نشانه‌هایی که معمولاً مشاهده می‌شود..."
                rows={3}
                className={cn(inputVariants.default, "resize-none")}
              />
            </div>
          </>
        );

      case 'ToDo':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>مشکل</label>
              <input
                type="text"
                value={formData.problem || ''}
                onChange={(e) => updateFormData('problem', e.target.value)}
                placeholder="مثال: کمبود مهارت‌های فنی"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>هدف قابل‌سنجش</label>
              <input
                type="text"
                value={formData.goal || ''}
                onChange={(e) => updateFormData('goal', e.target.value)}
                placeholder="مثال: یادگیری پایتون در ۳ ماه"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      case 'VisualExample':
        return (
          <>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>سوال/نکته اصلی</label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => updateFormData('question', e.target.value)}
                placeholder="مثال: نحوه درست کردن قهوه حرفه‌ای"
                className={inputVariants.default}
              />
            </div>
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>ابزار احتمالی (اختیاری)</label>
              <input
                type="text"
                value={formData.tools || ''}
                onChange={(e) => updateFormData('tools', e.target.value)}
                placeholder="مثال: قهوه‌جوش، فیلتر، ترازو"
                className={inputVariants.default}
              />
            </div>
          </>
        );

      default:
        return (
          <div className={formFieldVariants.wrapper}>
            <p className={textVariants.body}>
              این قالب نیاز به تنظیمات خاصی ندارد. روی دکمه تولید کلیک کنید.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className={cardVariants.default}>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className={textVariants.h3}>تنظیمات قالب</h3>
            <p className={textVariants.small}>فیلدهای ضروری را تکمیل کنید</p>
          </div>

          {renderFormFields()}

          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                buttonVariants.primary,
                "w-full",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  در حال تولید...
                </>
              ) : (
                'ساخت خروجی'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};