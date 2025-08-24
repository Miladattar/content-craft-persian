import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Copy, Play, Code2 } from "lucide-react";

interface Prompt {
  id: string;
  name: string;
  template_type: string;
  system_prompt?: string;
  user_prompt_template: string;
  variables: any;
  max_tokens: number;
  temperature: number;
  model: string;
  is_active: boolean;
  version: number;
  description?: string;
  created_at: string;
}

const TEMPLATE_TYPES = [
  'Story', 'Limit', 'Contrast', 'WrongRight', 'ProNovice', 'Warning',
  'NoWords', 'Suspense', 'Review', 'Empathy', 'Choice', 'Compare',
  'Fortune', 'ToDo', 'VisualExample', 'PainDiscovery', 'Idea120'
];

const AI_MODELS = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3'];

export function PromptManager() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    template_type: '',
    system_prompt: '',
    user_prompt_template: '',
    variables: '',
    max_tokens: 1000,
    temperature: 0.7,
    model: 'gpt-4',
    is_active: true,
    description: ''
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('template_type', { ascending: true });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast({
        title: "خطا در بارگذاری",
        description: "خطا در بارگذاری پرامپت‌ها",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      template_type: '',
      system_prompt: '',
      user_prompt_template: '',
      variables: '',
      max_tokens: 1000,
      temperature: 0.7,
      model: 'gpt-4',
      is_active: true,
      description: ''
    });
    setEditingPrompt(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promptData = {
        ...formData,
        variables: formData.variables.split(',').map(v => v.trim()).filter(Boolean),
        temperature: Number(formData.temperature),
        max_tokens: Number(formData.max_tokens)
      };

      if (editingPrompt) {
        const { error } = await supabase
          .from('prompts')
          .update(promptData)
          .eq('id', editingPrompt.id);

        if (error) throw error;
        toast({ title: "ویرایش شد", description: "پرامپت با موفقیت ویرایش شد" });
      } else {
        const { error } = await supabase
          .from('prompts')
          .insert([promptData]);

        if (error) throw error;
        toast({ title: "اضافه شد", description: "پرامپت جدید با موفقیت اضافه شد" });
      }

      setIsCreateOpen(false);
      resetForm();
      loadPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره پرامپت",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (prompt: Prompt) => {
    setFormData({
      name: prompt.name,
      template_type: prompt.template_type,
      system_prompt: prompt.system_prompt || '',
      user_prompt_template: prompt.user_prompt_template,
      variables: prompt.variables?.join(', ') || '',
      max_tokens: prompt.max_tokens,
      temperature: prompt.temperature,
      model: prompt.model,
      is_active: prompt.is_active,
      description: prompt.description || ''
    });
    setEditingPrompt(prompt);
    setIsCreateOpen(true);
  };

  const handleDelete = async (promptId: string) => {
    if (!confirm('آیا از حذف این پرامپت اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;
      
      toast({ title: "حذف شد", description: "پرامپت با موفقیت حذف شد" });
      loadPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف پرامپت",
        variant: "destructive"
      });
    }
  };

  const handleCopy = (prompt: Prompt) => {
    const promptText = `System Prompt:\n${prompt.system_prompt || ''}\n\nUser Prompt:\n${prompt.user_prompt_template}`;
    navigator.clipboard.writeText(promptText);
    toast({ title: "کپی شد", description: "پرامپت در کلیپ‌برد کپی شد" });
  };

  const testPrompt = async (prompt: Prompt) => {
    // This would integrate with your AI testing system
    toast({ 
      title: "تست پرامپت", 
      description: "قابلیت تست پرامپت به زودی اضافه خواهد شد" 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مدیریت پرامپت‌ها</h2>
          <p className="text-muted-foreground">مدیریت قالب‌های پرامپت هوش مصنوعی</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              پرامپت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrompt ? 'ویرایش پرامپت' : 'ایجاد پرامپت جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات پرامپت هوش مصنوعی را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نام پرامپت</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع قالب</Label>
                  <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب نوع قالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>توضیحات</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیح مختصری از کاربرد این پرامپت"
                />
              </div>

              <div className="space-y-2">
                <Label>پرامپت سیستم (اختیاری)</Label>
                <Textarea
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  placeholder="دستورالعمل‌های کلی برای هوش مصنوعی..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>قالب پرامپت کاربر</Label>
                <Textarea
                  value={formData.user_prompt_template}
                  onChange={(e) => setFormData({ ...formData, user_prompt_template: e.target.value })}
                  placeholder="قالب پرامپت با متغیرهای {variable_name}..."
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>متغیرها (جدا شده با ویرگول)</Label>
                <Input
                  value={formData.variables}
                  onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                  placeholder="topic, audience, tone"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>مدل هوش مصنوعی</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map(model => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>حداکثر توکن</Label>
                  <Input
                    type="number"
                    min="100"
                    max="4000"
                    value={formData.max_tokens}
                    onChange={(e) => setFormData({ ...formData, max_tokens: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>دما (Temperature)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>فعال</Label>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">
                  {editingPrompt ? 'ویرایش' : 'ایجاد'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام پرامپت</TableHead>
                <TableHead>نوع قالب</TableHead>
                <TableHead>مدل</TableHead>
                <TableHead>تنظیمات</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{prompt.name}</div>
                      {prompt.description && (
                        <div className="text-sm text-muted-foreground">{prompt.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{prompt.template_type}</Badge>
                  </TableCell>
                  <TableCell>{prompt.model}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>توکن: {prompt.max_tokens}</div>
                      <div>دما: {prompt.temperature}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prompt.is_active ? "default" : "secondary"}>
                      {prompt.is_active ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(prompt)}
                        title="کپی پرامپت"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testPrompt(prompt)}
                        title="تست پرامپت"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(prompt)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(prompt.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {prompts.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              هیچ پرامپتی یافت نشد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}