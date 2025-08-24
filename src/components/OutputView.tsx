import { useState } from 'react';
import { Copy, Download, Edit3, CheckCircle, FileText, Video, Image, Radio } from 'lucide-react';
import { TemplateOutput, BriefData, StrategySnapshot, OutputTab } from '../lib/schemas-ui';
import { buttonVariants, cardVariants, textVariants, badgeVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface OutputViewProps {
  output: TemplateOutput;
  template: string;
  brief: BriefData | StrategySnapshot;
  onEdit: () => void;
}

export const OutputView = ({ output, template, brief, onEdit }: OutputViewProps) => {
  const [activeTab, setActiveTab] = useState<OutputTab>('reels');
  const { toast } = useToast();

  const tabs = [
    { id: 'reels' as OutputTab, label: 'ریلز', icon: Video },
    { id: 'story' as OutputTab, label: 'استوری', icon: Image },
    { id: 'post' as OutputTab, label: 'پست', icon: FileText },
    { id: 'live' as OutputTab, label: 'لایو', icon: Radio }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: "متن در کلیپ‌بورد کپی شد"
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "متن کپی نشد",
        variant: "destructive"
      });
    }
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "دانلود شد",
      description: "فایل مارک‌دان دانلود شد"
    });
  };

  const renderOutputContent = () => {
    // For Idea120 template
    if ('items' in output && output.items) {
      return (
        <div className="space-y-6">
          <div className={cardVariants.default}>
            <h3 className={textVariants.h3}>۱۲۰ ایده محتوا</h3>
            {output.assumptions && (
              <p className={cn(textVariants.small, "mb-4 text-muted-foreground")}>
                {output.assumptions}
              </p>
            )}
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {output.items.map((item) => (
                <div key={item.n} className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-muted/30 rounded-lg">
                  <span className="font-bold text-primary min-w-[2rem]">{item.n}</span>
                  <span className="flex-1">{item.title}</span>
                  {item.format && (
                    <span className={cn(badgeVariants.outline, "text-xs")}>
                      {item.format}
                    </span>
                  )}
                  <button
                    onClick={() => copyToClipboard(item.title)}
                    className={cn(buttonVariants.ghost, "p-1 h-8 w-8")}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {output.buckets && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className={textVariants.h4}>دسته‌بندی محتوا</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {output.buckets.map((bucket, index) => (
                    <div key={index} className="text-center">
                      <div className={cn(badgeVariants.default, "w-full justify-center mb-2")}>
                        {bucket.count}
                      </div>
                      <div className={textVariants.small}>{bucket.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // For Story template
    if ('hook' in output && 'story' in output && 'cta' in output) {
      return (
        <div className="space-y-4">
          <div className={cardVariants.default}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={textVariants.h4}>قلاب</h4>
              <button
                onClick={() => copyToClipboard(output.hook)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={textVariants.body}>{output.hook}</p>
          </div>

          <div className={cardVariants.default}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={textVariants.h4}>داستان</h4>
              <button
                onClick={() => copyToClipboard(output.story)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={textVariants.body}>{output.story}</p>
          </div>

          <div className={cardVariants.default}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={textVariants.h4}>فراخوان عمل</h4>
              <button
                onClick={() => copyToClipboard(output.cta)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={textVariants.body}>{output.cta}</p>
          </div>
        </div>
      );
    }

    // For templates with beats (Suspense)
    if ('beats' in output && output.beats && 'script' in output) {
      return (
        <div className="space-y-4">
          <div className={cardVariants.default}>
            <h4 className={textVariants.h4}>نقشه ضرب‌آهنگ</h4>
            <div className="space-y-2 mt-4">
              {output.beats.map((beat) => (
                <div key={beat.id} className="flex items-start space-x-3 rtl:space-x-reverse p-3 bg-muted/30 rounded-lg">
                  <span className={cn(badgeVariants.default, "min-w-[2rem] text-center")}>
                    {beat.id}
                  </span>
                  <span className="flex-1">{beat.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={cardVariants.default}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={textVariants.h4}>متن نهایی</h4>
              <button
                onClick={() => copyToClipboard(output.script)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className={textVariants.body}>{output.script}</p>
          </div>
        </div>
      );
    }

    // For WrongRight template
    if ('wrong_vo' in output && 'right_vo' in output) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className={cn(textVariants.h3, "text-destructive")}>روش غلط</h3>
            
            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>صدا</h4>
              <p className={textVariants.body}>{output.wrong_vo}</p>
              <button
                onClick={() => copyToClipboard(output.wrong_vo)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>برنامه</h4>
              <p className={textVariants.body}>{output.wrong_plan}</p>
              <button
                onClick={() => copyToClipboard(output.wrong_plan)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>قلاب</h4>
              <p className={textVariants.body}>{output.wrong_hook}</p>
              <button
                onClick={() => copyToClipboard(output.wrong_hook)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={cn(textVariants.h3, "text-success")}>روش درست</h3>
            
            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>صدا</h4>
              <p className={textVariants.body}>{output.right_vo}</p>
              <button
                onClick={() => copyToClipboard(output.right_vo)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>برنامه</h4>
              <p className={textVariants.body}>{output.right_plan}</p>
              <button
                onClick={() => copyToClipboard(output.right_plan)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className={cardVariants.default}>
              <h4 className={textVariants.h4}>قلاب</h4>
              <p className={textVariants.body}>{output.right_hook}</p>
              <button
                onClick={() => copyToClipboard(output.right_hook)}
                className={cn(buttonVariants.ghost, "mt-2 p-1")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // For NoWords template
    if ('ideas' in output && output.ideas && 'hooks' in output) {
      return (
        <div className="space-y-6">
          <div className={cardVariants.default}>
            <h4 className={textVariants.h4}>ایده‌های تصویری</h4>
            <div className="space-y-4 mt-4">
              {output.ideas.map((idea, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className={cn(
                      badgeVariants.default,
                      idea.shock === 'mild' ? 'bg-success' :
                      idea.shock === 'medium' ? 'bg-warning' : 'bg-destructive'
                    )}>
                      {idea.shock === 'mild' ? 'ملایم' :
                       idea.shock === 'medium' ? 'متوسط' : 'شدید'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">تصویر</h5>
                      <p className={textVariants.small}>{idea.visual}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">پیام</h5>
                      <p className={textVariants.small}>{idea.message}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">نحوه اجرا</h5>
                      <p className={textVariants.small}>{idea.how}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${idea.visual} | ${idea.message} | ${idea.how}`)}
                    className={cn(buttonVariants.ghost, "w-full mt-2")}
                  >
                    <Copy className="w-4 h-4 ml-2" />
                    کپی ایده
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={cardVariants.default}>
            <h4 className={textVariants.h4}>قلاب‌های پیشنهادی</h4>
            <div className="space-y-2 mt-4">
              {output.hooks.map((hook, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span>{hook}</span>
                  <button
                    onClick={() => copyToClipboard(hook)}
                    className={cn(buttonVariants.ghost, "p-1")}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // For templates with simple script output
    if ('script' in output && typeof output.script === 'string') {
      const content = output.script;
      return (
        <div className={cardVariants.default}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={textVariants.h4}>محتوای تولید شده</h4>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => copyToClipboard(content)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => downloadMarkdown(content, `content-${template}`)}
                className={cn(buttonVariants.ghost, "p-2")}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className={textVariants.body}>{content}</p>
          </div>
        </div>
      );
    }

    // Fallback for other template types
    return (
      <div className={cardVariants.default}>
        <h4 className={textVariants.h4}>خروجی تولید شده</h4>
        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg mt-4">
          {JSON.stringify(output, null, 2)}
        </pre>
        <button
          onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}
          className={cn(buttonVariants.ghost, "mt-2")}
        >
          <Copy className="w-4 h-4 ml-2" />
          کپی JSON
        </button>
      </div>
    );
  };

  return (
    <div className={cn(animationVariants.fadeIn, "max-w-6xl mx-auto")}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={textVariants.h2}>خروجی محتوا</h2>
          <p className={textVariants.small}>قالب: {template}</p>
        </div>
        <button
          onClick={onEdit}
          className={cn(buttonVariants.outline)}
        >
          <Edit3 className="w-4 h-4 ml-2" />
          ویرایش بریف
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 rtl:space-x-reverse bg-muted p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-md transition-all flex-1 justify-center",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className={animationVariants.fadeIn}>
            {renderOutputContent()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className={cardVariants.default}>
            <h4 className={textVariants.h4}>اطلاعات بریف</h4>
            <div className="space-y-3 mt-4">
              <div>
                <span className={textVariants.small}>هدف:</span>
                <div className={cn(badgeVariants.outline, "mr-2")}>
                  {'goal' in brief ? (
                    brief.goal === 'sales' ? 'فروش' :
                    brief.goal === 'awareness' ? 'آگاهی' : 'لیدگیری'
                  ) : 'نامشخص'}
                </div>
              </div>
              
              {('industry' in brief) && (
                <div>
                  <span className={textVariants.small}>حوزه:</span>
                  <p className="text-sm mt-1">{brief.industry}</p>
                </div>
              )}
              
              {('tone' in brief) && (
                <div>
                  <span className={textVariants.small}>لحن:</span>
                  <p className="text-sm mt-1">{brief.tone}</p>
                </div>
              )}
            </div>
          </div>

          <div className={cardVariants.default}>
            <h4 className={textVariants.h4}>عملیات سریع</h4>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}
                className={cn(buttonVariants.ghost, "w-full justify-start")}
              >
                <Copy className="w-4 h-4 ml-2" />
                کپی همه محتوا
              </button>
              <button
                onClick={() => downloadMarkdown(JSON.stringify(output, null, 2), `output-${template}`)}
                className={cn(buttonVariants.ghost, "w-full justify-start")}
              >
                <Download className="w-4 h-4 ml-2" />
                دانلود فایل
              </button>
            </div>
          </div>

          <div className={cardVariants.default}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium text-success">تولید موفق</span>
            </div>
            <p className={textVariants.small}>
              محتوای شما بر اساس بریف و قالب انتخابی تولید شد
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};