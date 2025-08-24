import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { HookBankManager } from "@/components/admin/HookBankManager";
import { PromptManager } from "@/components/admin/PromptManager";
import { UserRoleManager } from "@/components/admin/UserRoleManager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Settings, MessageSquare, Code, Users, BarChart3 } from "lucide-react";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "دسترسی غیرمجاز",
          description: "لطفا ابتدا وارد حساب کاربری خود شوید",
          variant: "destructive"
        });
        return;
      }

      // Check if user has admin role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const hasAdminRole = userRoles?.some(role => role.role === 'admin');
      setIsAdmin(hasAdminRole || false);

      if (!hasAdminRole) {
        toast({
          title: "دسترسی محدود",
          description: "شما دسترسی به پنل مدیریت ندارید",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "خطا",
        description: "خطا در بررسی دسترسی",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">دسترسی محدود</h1>
          <p className="text-muted-foreground mb-6">
            شما دسترسی به پنل مدیریت ندارید. لطفا با مدیر سیستم تماس بگیرید.
          </p>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            بازگشت به صفحه اصلی
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">پنل مدیریت</h1>
                <p className="text-sm text-muted-foreground">مدیریت سیستم تولید محتوا</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                بازگشت به سایت
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              تنظیمات
            </TabsTrigger>
            <TabsTrigger value="hooks" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              بانک قلاب‌ها
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              پرامپت‌ها
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              کاربران
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>

            <TabsContent value="hooks">
              <HookBankManager />
            </TabsContent>

            <TabsContent value="prompts">
              <PromptManager />
            </TabsContent>

            <TabsContent value="users">
              <UserRoleManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}