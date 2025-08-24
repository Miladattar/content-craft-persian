import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Save, RefreshCw, Settings2 } from "lucide-react";

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  display_name: string;
  description: string;
  category: string;
  is_active: boolean;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('category, display_name');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "خطا در بارگذاری",
        description: "خطا در بارگذاری تنظیمات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingId: string, newValue: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          setting_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingId);

      if (error) throw error;

      setSettings(prev => prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, setting_value: newValue }
          : setting
      ));

      toast({
        title: "ذخیره شد",
        description: "تنظیمات با موفقیت به‌روزرسانی شد"
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی تنظیمات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: AdminSetting) => {
    const handleChange = (value: any) => {
      updateSetting(setting.id, value);
    };

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.setting_value}
            onCheckedChange={handleChange}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={setting.setting_value || 0}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            className="w-32"
          />
        );
      
      case 'array':
      case 'json':
        return (
          <Textarea
            value={JSON.stringify(setting.setting_value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(parsed);
              } catch {
                // Invalid JSON, don't update
              }
            }}
            className="font-mono text-sm"
            rows={4}
          />
        );
      
      default:
        return (
          <Input
            value={String(setting.setting_value || '')}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={setting.description}
          />
        );
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, AdminSetting[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">تنظیمات سیستم</h2>
          <p className="text-muted-foreground">مدیریت پارامترهای پیکربندی سیستم</p>
        </div>
        <Button
          onClick={loadSettings}
          variant="outline"
          disabled={saving}
        >
          <RefreshCw className={`h-4 w-4 ml-2 ${saving ? 'animate-spin' : ''}`} />
          بروزرسانی
        </Button>
      </div>

      <Tabs defaultValue={Object.keys(groupedSettings)[0]} className="w-full">
        <TabsList>
          {Object.keys(groupedSettings).map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {getCategoryName(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4">
              {categorySettings.map(setting => (
                <Card key={setting.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{setting.display_name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={setting.is_active ? "default" : "secondary"}>
                          {setting.is_active ? "فعال" : "غیرفعال"}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {setting.setting_type}
                        </Badge>
                      </div>
                    </div>
                    {setting.description && (
                      <CardDescription>{setting.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Label className="text-sm font-medium min-w-0 flex-shrink-0">
                        مقدار:
                      </Label>
                      <div className="flex-1">
                        {renderSettingInput(setting)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'general': 'عمومی',
    'limits': 'محدودیت‌ها',
    'content': 'محتوا',
    'templates': 'قالب‌ها',
    'system': 'سیستم'
  };
  return categoryNames[category] || category;
}