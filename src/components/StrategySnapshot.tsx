import { useState, useEffect } from 'react';
import { Target, TrendingUp, BarChart3, Clock, CheckCircle } from 'lucide-react';
import { BriefData, StrategySnapshot as StrategyData } from '../lib/schemas-ui';
import { postJSON, getErrorMessage, mockApi } from '../lib/fetcher';
import { buttonVariants, cardVariants, textVariants, badgeVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface StrategySnapshotProps {
  brief: BriefData;
  onComplete: (snapshot: StrategyData) => void;
}

export const StrategySnapshot = ({ brief, onComplete }: StrategySnapshotProps) => {
  const [snapshot, setSnapshot] = useState<StrategyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    generateSnapshot();
  }, []);

  const generateSnapshot = async () => {
    setIsLoading(true);
    try {
      // Using mock API for now - replace with actual API call
      const result = await mockApi.strategy(brief);
      setSnapshot(result);
      onComplete(result);
    } catch (error) {
      toast({
        title: "خطا در تولید استراتژی",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className={cn(animationVariants.fadeIn)}>
          <div className="bg-gradient-hero rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Target className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className={textVariants.h2}>در حال تحلیل و ساخت استراتژی...</h2>
          <p className={textVariants.body}>این فرآیند چند ثانیه طول می‌کشد</p>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="text-center">
        <p className="text-destructive">خطا در تولید استراتژی</p>
        <button
          onClick={generateSnapshot}
          className={cn(buttonVariants.outline, "mt-4")}
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  const getFunnelColor = (percentage: number) => {
    if (percentage >= 50) return 'bg-success';
    if (percentage >= 30) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className={cn(animationVariants.fadeIn, "max-w-6xl mx-auto space-y-8")}>
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <CheckCircle className="w-6 h-6 text-success" />
          <h2 className={textVariants.h2}>اسنپ‌شات استراتژی شما</h2>
        </div>
        <p className={textVariants.body}>بر اساس بریف شما، استراتژی زیر طراحی شده است</p>
      </div>

      {/* Goal & Tone */}
      <div className={cn(cardVariants.default, "text-center space-y-4")}>
        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
          <span className={cn(badgeVariants.default, "text-lg px-6 py-2")}>
            هدف: {snapshot.goal === 'sales' ? 'افزایش فروش' : 
                   snapshot.goal === 'awareness' ? 'افزایش آگاهی' : 'لیدگیری'}
          </span>
          <span className={cn(badgeVariants.outline, "text-lg px-6 py-2")}>
            لحن: {snapshot.tone}
          </span>
        </div>
      </div>

      {/* Pillars */}
      <div className={cardVariants.default}>
        <h3 className={cn(textVariants.h3, "flex items-center space-x-2 rtl:space-x-reverse mb-6")}>
          <Target className="w-6 h-6 text-primary" />
          <span>ستون‌های محتوایی</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snapshot.pillars.map((pillar, index) => (
            <div
              key={index}
              className={cn(
                cardVariants.compact,
                "border-r-4 border-primary bg-primary-light/30 text-center"
              )}
            >
              <span className="font-medium text-primary-foreground">{pillar}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel Analysis */}
      <div className={cardVariants.default}>
        <h3 className={cn(textVariants.h3, "flex items-center space-x-2 rtl:space-x-reverse mb-6")}>
          <TrendingUp className="w-6 h-6 text-primary" />
          <span>تحلیل قیف فروش (درصد)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${snapshot.funnel.awareness * 2.51} 251`}
                  className="text-success"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-success">{snapshot.funnel.awareness}%</span>
              </div>
            </div>
            <div>
              <h4 className={textVariants.h4}>آگاهی</h4>
              <p className={textVariants.small}>جذب مخاطب جدید</p>
            </div>
          </div>

          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${snapshot.funnel.consideration * 2.51} 251`}
                  className="text-warning"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-warning">{snapshot.funnel.consideration}%</span>
              </div>
            </div>
            <div>
              <h4 className={textVariants.h4}>بررسی</h4>
              <p className={textVariants.small}>علاقه‌مندی و اعتماد</p>
            </div>
          </div>

          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${snapshot.funnel.action * 2.51} 251`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{snapshot.funnel.action}%</span>
              </div>
            </div>
            <div>
              <h4 className={textVariants.h4}>اقدام</h4>
              <p className={textVariants.small}>خرید و تبدیل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Mix */}
      <div className={cardVariants.default}>
        <h3 className={cn(textVariants.h3, "flex items-center space-x-2 rtl:space-x-reverse mb-6")}>
          <BarChart3 className="w-6 h-6 text-primary" />
          <span>ترکیب هفتگی محتوا</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 font-semibold">نوع محتوا</th>
                <th className="py-3 px-4 font-semibold">تعداد هفتگی</th>
                <th className="py-3 px-4 font-semibold">درصد</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">ریلز</td>
                <td className="py-3 px-4">{snapshot.mix_weekly.reels}</td>
                <td className="py-3 px-4">
                  <span className={cn(badgeVariants.default)}>
                    {Math.round((snapshot.mix_weekly.reels / (snapshot.mix_weekly.reels + snapshot.mix_weekly.stories + snapshot.mix_weekly.posts)) * 100)}%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium">استوری</td>
                <td className="py-3 px-4">{snapshot.mix_weekly.stories}</td>
                <td className="py-3 px-4">
                  <span className={cn(badgeVariants.secondary)}>
                    {Math.round((snapshot.mix_weekly.stories / (snapshot.mix_weekly.reels + snapshot.mix_weekly.stories + snapshot.mix_weekly.posts)) * 100)}%
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">پست</td>
                <td className="py-3 px-4">{snapshot.mix_weekly.posts}</td>
                <td className="py-3 px-4">
                  <span className={cn(badgeVariants.outline)}>
                    {Math.round((snapshot.mix_weekly.posts / (snapshot.mix_weekly.reels + snapshot.mix_weekly.stories + snapshot.mix_weekly.posts)) * 100)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Guardrails */}
      {snapshot.guardrails.length > 0 && (
        <div className={cardVariants.default}>
          <h3 className={cn(textVariants.h3, "flex items-center space-x-2 rtl:space-x-reverse mb-4")}>
            <Clock className="w-6 h-6 text-primary" />
            <span>گاردریل‌های محتوایی</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {snapshot.guardrails.map((guardrail, index) => (
              <span key={index} className={cn(badgeVariants.outline)}>
                {guardrail}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={() => {
            toast({
              title: "اسنپ‌شات ذخیره شد",
              description: "استراتژی شما آماده استفاده است"
            });
          }}
          className={cn(buttonVariants.ghost, "text-sm")}
        >
          ارسال به بک‌لاگ
        </button>
      </div>
    </div>
  );
};