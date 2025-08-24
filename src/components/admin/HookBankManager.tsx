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
import { Plus, Edit, Trash2, Search, Filter, TrendingUp } from "lucide-react";

interface HookBank {
  id: string;
  title: string;
  content: string;
  category: string;
  target_audience?: string;
  tone?: string;
  industry?: string;
  template_type?: string;
  performance_score: number;
  usage_count: number;
  is_active: boolean;
  tags?: string[];
  created_at: string;
}

const CATEGORIES = ['فروش', 'آموزشی', 'خدماتی', 'تبلیغاتی', 'اجتماعی'];
const TONES = ['خودمونی-حرفه‌ای', 'رسمی', 'خودمونی'];
const TEMPLATE_TYPES = ['Story', 'Limit', 'Contrast', 'Warning', 'Suspense'];

export function HookBankManager() {
  const [hooks, setHooks] = useState<HookBank[]>([]);
  const [filteredHooks, setFilteredHooks] = useState<HookBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHook, setEditingHook] = useState<HookBank | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    target_audience: '',
    tone: '',
    industry: '',
    template_type: '',
    performance_score: 0,
    is_active: true,
    tags: ''
  });

  useEffect(() => {
    loadHooks();
  }, []);

  useEffect(() => {
    filterHooks();
  }, [hooks, searchTerm, categoryFilter]);

  const loadHooks = async () => {
    try {
      const { data, error } = await supabase
        .from('hook_banks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHooks(data || []);
    } catch (error) {
      console.error('Error loading hooks:', error);
      toast({
        title: "خطا در بارگذاری",
        description: "خطا در بارگذاری بانک قلاب‌ها",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHooks = () => {
    let filtered = hooks;

    if (searchTerm) {
      filtered = filtered.filter(hook =>
        hook.title.includes(searchTerm) ||
        hook.content.includes(searchTerm) ||
        hook.tags?.some(tag => tag.includes(searchTerm))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(hook => hook.category === categoryFilter);
    }

    setFilteredHooks(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      target_audience: '',
      tone: '',
      industry: '',
      template_type: '',
      performance_score: 0,
      is_active: true,
      tags: ''
    });
    setEditingHook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const hookData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        performance_score: Number(formData.performance_score)
      };

      if (editingHook) {
        const { error } = await supabase
          .from('hook_banks')
          .update(hookData)
          .eq('id', editingHook.id);

        if (error) throw error;
        toast({ title: "ویرایش شد", description: "قلاب با موفقیت ویرایش شد" });
      } else {
        const { error } = await supabase
          .from('hook_banks')
          .insert([hookData]);

        if (error) throw error;
        toast({ title: "اضافه شد", description: "قلاب جدید با موفقیت اضافه شد" });
      }

      setIsCreateOpen(false);
      resetForm();
      loadHooks();
    } catch (error) {
      console.error('Error saving hook:', error);
      toast({
        title: "خطا",
        description: "خطا در ذخیره قلاب",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (hook: HookBank) => {
    setFormData({
      title: hook.title,
      content: hook.content,
      category: hook.category,
      target_audience: hook.target_audience || '',
      tone: hook.tone || '',
      industry: hook.industry || '',
      template_type: hook.template_type || '',
      performance_score: hook.performance_score,
      is_active: hook.is_active,
      tags: hook.tags?.join(', ') || ''
    });
    setEditingHook(hook);
    setIsCreateOpen(true);
  };

  const handleDelete = async (hookId: string) => {
    if (!confirm('آیا از حذف این قلاب اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('hook_banks')
        .delete()
        .eq('id', hookId);

      if (error) throw error;
      
      toast({ title: "حذف شد", description: "قلاب با موفقیت حذف شد" });
      loadHooks();
    } catch (error) {
      console.error('Error deleting hook:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف قلاب",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">بانک قلاب‌ها</h2>
          <p className="text-muted-foreground">مدیریت مجموعه قلاب‌های محتوایی</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 ml-2" />
              قلاب جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingHook ? 'ویرایش قلاب' : 'ایجاد قلاب جدید'}
              </DialogTitle>
              <DialogDescription>
                اطلاعات قلاب محتوایی را وارد کنید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان قلاب</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>دسته‌بندی</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>متن قلاب</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>مخاطب هدف</Label>
                  <Input
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>لحن</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب لحن" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map(tone => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>صنعت</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع قالب</Label>
                  <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب قالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>امتیاز عملکرد</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.performance_score}
                    onChange={(e) => setFormData({ ...formData, performance_score: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>برچسب‌ها (جدا شده با ویرگول)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="فروش، آمار، اشتباه"
                />
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
                  {editingHook ? 'ویرایش' : 'ایجاد'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو در قلاب‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فیلتر دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه دسته‌ها</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>دسته‌بندی</TableHead>
                <TableHead>محتوا</TableHead>
                <TableHead>عملکرد</TableHead>
                <TableHead>استفاده</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHooks.map((hook) => (
                <TableRow key={hook.id}>
                  <TableCell className="font-medium">{hook.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{hook.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{hook.content}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {hook.performance_score}%
                    </div>
                  </TableCell>
                  <TableCell>{hook.usage_count}</TableCell>
                  <TableCell>
                    <Badge variant={hook.is_active ? "default" : "secondary"}>
                      {hook.is_active ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(hook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredHooks.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              هیچ قلابی یافت نشد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}