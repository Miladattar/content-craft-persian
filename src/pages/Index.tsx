import { Link } from "react-router-dom";
import { Sparkles, Target, Users, Zap, ArrowLeft } from "lucide-react";
import { buttonVariants, cardVariants, textVariants, layoutVariants, animationVariants } from "../lib/ui";
import { cn } from "../lib/utils";

const Index = () => {
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
            <Link
              to="/brief"
              className={cn(buttonVariants.hero, animationVariants.scaleIn)}
            >
              شروع ساخت محتوا
              <ArrowLeft className="w-6 h-6 mr-3" />
            </Link>
          </div>

          {/* Additional Info */}
          <div className={cn(cardVariants.default, "mt-12 text-center")}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary">۱۹</div>
                <div className={textVariants.small}>قالب محتوا</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">۱۲۰</div>
                <div className={textVariants.small}>ایده در یک کلیک</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">۴</div>
                <div className={textVariants.small}>فرمت خروجی</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">۱۰۰٪</div>
                <div className={textVariants.small}>فارسی</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
