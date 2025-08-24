import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { BriefData, CampaignGoal, PageType, ToneType } from '../lib/schemas-ui';
import { buttonVariants, cardVariants, textVariants, inputVariants, formFieldVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';

interface BriefFormProps {
  onSubmit: (brief: BriefData) => void;
}

export const BriefForm = ({ onSubmit }: BriefFormProps) => {
  const [formData, setFormData] = useState<BriefData>({
    goal: 'sales',
    industry: '',
    pageType: 'educational',
    audience: '',
    tone: 'friendly-professional',
    guardrails: [],
    weeklyCapacity: 5
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BriefData, string>>>({});

  const goalOptions = [
    { value: 'sales' as CampaignGoal, label: 'افزایش فروش' },
    { value: 'awareness' as CampaignGoal, label: 'افزایش آگاهی' },
    { value: 'leads' as CampaignGoal, label: 'لیدگیری' }
  ];

  const pageTypeOptions = [
    { value: 'educational' as PageType, label: 'آموزشی' },
    { value: 'service' as PageType, label: 'خدماتی' },
    { value: 'product' as PageType, label: 'محصول‌محور' }
  ];

  const toneOptions = [
    { value: 'friendly-professional' as ToneType, label: 'خودمونی-حرفه‌ای' },
    { value: 'formal' as ToneType, label: 'رسمی' },
    { value: 'friendly' as ToneType, label: 'خودمونی' }
  ];

  const guardrailOptions = [
    'بی‌اغراق/بدون منبع',
    'رعایت قوانین پزشکی/مالی',
    'بدون ایموجی/نقل‌قول'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof BriefData, string>> = {};
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'حوزه/صنعت الزامی است';
    }
    
    if (!formData.audience.trim()) {
      newErrors.audience = 'مخاطب هدف الزامی است';
    }
    
    if (formData.weeklyCapacity < 1) {
      newErrors.weeklyCapacity = 'ظرفیت هفتگی باید حداقل ۱ باشد';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(formData);
  };

  const updateFormData = (key: keyof BriefData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const toggleGuardrail = (guardrail: string) => {
    const newGuardrails = formData.guardrails.includes(guardrail)
      ? formData.guardrails.filter(g => g !== guardrail)
      : [...formData.guardrails, guardrail];
    updateFormData('guardrails', newGuardrails);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className={cn(animationVariants.fadeIn, "text-center mb-8")}>
        <h2 className={textVariants.h2}>بیایید بریف شما را بسازیم</h2>
        <p className={textVariants.body}>اطلاعات زیر به ما کمک می‌کند تا بهترین محتوا را برای شما تولید کنیم</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={cn(cardVariants.default, animationVariants.scaleIn)}>
          <div className="space-y-6">
            {/* هدف کمپین */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>هدف کمپین</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {goalOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData('goal', option.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg text-center transition-all",
                      formData.goal === option.value
                        ? "border-primary bg-primary-light text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* حوزه/صنعت */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>حوزه/صنعت</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => updateFormData('industry', e.target.value)}
                placeholder="مثال: فناوری اطلاعات، آموزش، بهداشت و درمان"
                className={cn(
                  inputVariants.default,
                  errors.industry && inputVariants.error
                )}
              />
              {errors.industry && (
                <p className={formFieldVariants.error}>{errors.industry}</p>
              )}
            </div>

            {/* نوع پیج */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>نوع پیج</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pageTypeOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData('pageType', option.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg text-center transition-all",
                      formData.pageType === option.value
                        ? "border-primary bg-primary-light text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* مخاطب هدف */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>مخاطب هدف</label>
              <textarea
                value={formData.audience}
                onChange={(e) => updateFormData('audience', e.target.value)}
                placeholder="مثال: زنان ۲۵-۴۰ ساله در تهران، علاقه‌مند به تکنولوژی، سطح آگاهی متوسط"
                rows={3}
                className={cn(
                  inputVariants.default,
                  errors.audience && inputVariants.error,
                  "resize-none"
                )}
              />
              {errors.audience && (
                <p className={formFieldVariants.error}>{errors.audience}</p>
              )}
            </div>

            {/* لحن */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>لحن</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {toneOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData('tone', option.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg text-center transition-all",
                      formData.tone === option.value
                        ? "border-primary bg-primary-light text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* گاردریل‌ها */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>گاردریل‌ها</label>
              <div className="space-y-3">
                {guardrailOptions.map(guardrail => (
                  <label
                    key={guardrail}
                    className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
                  >
                    <div
                      onClick={() => toggleGuardrail(guardrail)}
                      className={cn(
                        "w-5 h-5 border-2 rounded flex items-center justify-center transition-all",
                        formData.guardrails.includes(guardrail)
                          ? "border-primary bg-primary"
                          : "border-border"
                      )}
                    >
                      {formData.guardrails.includes(guardrail) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-foreground">{guardrail}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ظرفیت هفتگی */}
            <div className={formFieldVariants.wrapper}>
              <label className={formFieldVariants.label}>ظرفیت هفتگی (تعداد پست)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.weeklyCapacity}
                onChange={(e) => updateFormData('weeklyCapacity', parseInt(e.target.value) || 1)}
                className={cn(
                  inputVariants.default,
                  errors.weeklyCapacity && inputVariants.error,
                  "max-w-xs"
                )}
              />
              {errors.weeklyCapacity && (
                <p className={formFieldVariants.error}>{errors.weeklyCapacity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className={cn(buttonVariants.primary, "w-full md:w-auto")}
          >
            ادامه
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
        </div>
      </form>
    </div>
  );
};