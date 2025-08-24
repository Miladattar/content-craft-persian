import { useState } from 'react';
import { Sparkles, Target, Users, Zap } from 'lucide-react';
import { BriefForm } from '../components/BriefForm';
import { StrategySnapshot } from '../components/StrategySnapshot';
import { TemplateGrid } from '../components/TemplateGrid';
import { OutputView } from '../components/OutputView';
import { BriefData, StrategySnapshot as StrategyData, TemplateOutput } from '../lib/schemas-ui';
import { buttonVariants, cardVariants, textVariants, layoutVariants, animationVariants } from '../lib/ui';
import { cn } from '../lib/utils';

type Step = 'landing' | 'brief' | 'choice' | 'strategy' | 'templates' | 'output';

const Brief = () => {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [brief, setBrief] = useState<BriefData | null>(null);
  const [snapshot, setSnapshot] = useState<StrategyData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [output, setOutput] = useState<TemplateOutput | null>(null);

  const handleBriefSubmit = (briefData: BriefData) => {
    setBrief(briefData);
    setCurrentStep('choice');
  };

  const handleStrategyCreate = () => {
    setCurrentStep('strategy');
  };

  const handleTemplateSelect = () => {
    setCurrentStep('templates');
  };

  const handleSnapshotCreated = (snapshotData: StrategyData) => {
    setSnapshot(snapshotData);
  };

  const handleTemplateChoice = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleOutputGenerated = (outputData: TemplateOutput) => {
    setOutput(outputData);
    setCurrentStep('output');
  };

  const handleEditBrief = () => {
    setCurrentStep('brief');
  };

  const renderProgressSteps = () => {
    const steps = [
      { id: 'landing', label: 'شروع' },
      { id: 'brief', label: 'بریف' },
      { id: 'choice', label: 'انتخاب' },
      { id: 'templates', label: 'قالب' },
      { id: 'output', label: 'خروجی' }
    ];

    const currentIndex = steps.findIndex(step => step.id === currentStep);

    return (
      <div className="w-full bg-card border-b border-border">
        <div className={cn(layoutVariants.container, "py-4")}>
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  index <= currentIndex 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <span className={cn(
                  "mr-2 text-sm font-medium",
                  index <= currentIndex ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-px mx-4",
                    index < currentIndex ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-light/20">
        <div className={cn(layoutVariants.container, layoutVariants.section)}>
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className={cn(animationVariants.fadeIn, "space-y-6")}>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-hero rounded-full blur-2xl opacity-30" />
                  <div className="relative bg-gradient-hero p-6 rounded-full">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className={cn(textVariants.h1, "text-5xl lg:text-6xl gradient-primary bg-clip-text text-transparent")}>
                کرافت محتوا
              </h1>
              
              <p className={cn(textVariants.body, "text-xl text-muted-foreground max-w-2xl mx-auto")}>
                پلتفرم هوش مصنوعی برای تولید محتوای حرفه‌ای فارسی
                <br />
                از ایده تا اجرا، همه چیز در یک مکان
              </p>
            </div>

            {/* Features */}
            <div className={cn(layoutVariants.grid, layoutVariants.gridCols[3], "mt-12")}>
              <div className={cn(cardVariants.default, animationVariants.scaleIn, "text-center")}>
                <Target className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className={textVariants.h4}>استراتژی هوشمند</h3>
                <p className={textVariants.small}>بر اساس هدف و مخاطب شما</p>
              </div>
              
              <div className={cn(cardVariants.default, animationVariants.scaleIn, "text-center", "animation-delay-100")}>
                <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className={textVariants.h4}>۱۹ قالب محتوا</h3>
                <p className={textVariants.small}>از روایت تا آموزش تخصصی</p>
              </div>
              
              <div className={cn(cardVariants.default, animationVariants.scaleIn, "text-center", "animation-delay-200")}>
                <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className={textVariants.h4}>تولید سریع</h3>
                <p className={textVariants.small}>محتوا برای همه پلتفرم‌ها</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button
                onClick={() => setCurrentStep('brief')}
                className={cn(buttonVariants.hero, animationVariants.scaleIn)}
              >
                شروع ساخت محتوا
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderProgressSteps()}
      
      <div className={cn(layoutVariants.container, "py-8")}>
        {currentStep === 'brief' && (
          <div className={animationVariants.fadeIn}>
            <BriefForm onSubmit={handleBriefSubmit} />
          </div>
        )}

        {currentStep === 'choice' && brief && (
          <div className={cn(animationVariants.fadeIn, "max-w-4xl mx-auto text-center space-y-8")}>
            <div>
              <h2 className={textVariants.h2}>بریف شما آماده شد</h2>
              <p className={textVariants.body}>حالا می‌تونید اسنپ‌شات استراتژی بسازید یا مستقیم قالب انتخاب کنید</p>
            </div>

            <div className={cn(layoutVariants.grid, layoutVariants.gridCols[2], "max-w-2xl mx-auto")}>
              <button
                onClick={handleStrategyCreate}
                className={cn(cardVariants.interactive, "text-center space-y-4")}
              >
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className={textVariants.h4}>ساخت اسنپ‌شات استراتژی</h3>
                  <p className={textVariants.small}>تحلیل کامل و برنامه محتوایی</p>
                </div>
              </button>

              <button
                onClick={handleTemplateSelect}
                className={cn(cardVariants.interactive, "text-center space-y-4")}
              >
                <div className="bg-secondary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className={textVariants.h4}>انتخاب قالب پست</h3>
                  <p className={textVariants.small}>شروع سریع با قالب‌های آماده</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {currentStep === 'strategy' && brief && (
          <div className={animationVariants.fadeIn}>
            <StrategySnapshot 
              brief={brief} 
              onComplete={handleSnapshotCreated}
            />
          </div>
        )}

        {currentStep === 'templates' && brief && (
          <div className={animationVariants.fadeIn}>
            <TemplateGrid 
              brief={brief}
              snapshot={snapshot}
              onTemplateSelect={handleTemplateChoice}
              onOutputGenerated={handleOutputGenerated}
            />
          </div>
        )}

        {currentStep === 'output' && output && brief && (
          <div className={animationVariants.fadeIn}>
            <OutputView
              output={output}
              template={selectedTemplate}
              brief={snapshot || brief}
              onEdit={handleEditBrief}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Brief;