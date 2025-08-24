import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { TEMPLATES, BriefData, StrategySnapshot, TemplateOutput } from '../lib/schemas-ui';
import { TemplateForm } from './TemplateForm';
import { cardVariants, textVariants, buttonVariants, badgeVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';

interface TemplateGridProps {
  brief: BriefData;
  snapshot?: StrategySnapshot | null;
  onTemplateSelect: (templateId: string) => void;
  onOutputGenerated: (output: TemplateOutput) => void;
}

export const TemplateGrid = ({ brief, snapshot, onTemplateSelect, onOutputGenerated }: TemplateGridProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect(templateId);
  };

  const handleBackToGrid = () => {
    setSelectedTemplate(null);
  };

  const handleFormSubmit = (output: TemplateOutput) => {
    onOutputGenerated(output);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'educational':
        return { label: 'آموزشی', variant: badgeVariants.success };
      case 'service':
        return { label: 'خدماتی', variant: badgeVariants.warning };
      case 'product':
        return { label: 'محصولی', variant: badgeVariants.destructive };
      default:
        return { label: 'عمومی', variant: badgeVariants.default };
    }
  };

  if (selectedTemplate) {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return null;

    return (
      <div className={animationVariants.fadeIn}>
        <div className="mb-6">
          <button
            onClick={handleBackToGrid}
            className={cn(buttonVariants.ghost, "mb-4")}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            بازگشت به قالب‌ها
          </button>
          <div className="text-center space-y-2">
            <h2 className={textVariants.h2}>{template.title}</h2>
            <p className={textVariants.body}>{template.description}</p>
          </div>
        </div>

        <TemplateForm
          template={template}
          brief={brief}
          snapshot={snapshot}
          onSubmit={handleFormSubmit}
        />
      </div>
    );
  }

  return (
    <div className={cn(animationVariants.fadeIn, "max-w-7xl mx-auto")}>
      <div className="text-center space-y-4 mb-8">
        <h2 className={textVariants.h2}>انتخاب قالب محتوا</h2>
        <p className={textVariants.body}>از بین قالب‌های زیر، مناسب‌ترین را برای محتوای خود انتخاب کنید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {TEMPLATES.map((template) => {
          const badge = getCategoryBadge(template.category);
          
          return (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template.id)}
              className={cn(
                cardVariants.interactive,
                animationVariants.scaleIn,
                "space-y-4 cursor-pointer h-full flex flex-col"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="bg-gradient-primary rounded-lg p-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className={badge.variant}>{badge.label}</span>
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className={cn(textVariants.h4, "text-lg")}>{template.title}</h3>
                <p className={cn(textVariants.small, "text-muted-foreground line-clamp-2")}>
                  {template.description}
                </p>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="flex items-center text-primary text-sm font-medium">
                  <span>انتخاب قالب</span>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className={cn(cardVariants.default, "mt-8 text-center")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">{TEMPLATES.length}</div>
            <div className={textVariants.small}>قالب محتوا</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {TEMPLATES.filter(t => t.category === 'universal').length}
            </div>
            <div className={textVariants.small}>قالب عمومی</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">
              {TEMPLATES.filter(t => t.category === 'educational').length}
            </div>
            <div className={textVariants.small}>قالب آموزشی</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">
              {TEMPLATES.filter(t => t.category !== 'universal' && t.category !== 'educational').length}
            </div>
            <div className={textVariants.small}>قالب تخصصی</div>
          </div>
        </div>
      </div>
    </div>
  );
};