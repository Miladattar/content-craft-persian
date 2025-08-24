import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, UserPlus, Trash2, Shield, Users, Search } from "lucide-react";

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'user';
  created_at: string;
}

const ROLES = [
  { value: 'admin', label: 'مدیر', description: 'دسترسی کامل به همه بخش‌ها' },
  { value: 'editor', label: 'ویراستار', description: 'دسترسی به ویرایش محتوا و قلاب‌ها' },
  { value: 'user', label: 'کاربر', description: 'دسترسی محدود به استفاده از سیستم' }
];

export function UserRoleManager() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    role: 'user' as 'admin' | 'editor' | 'user'
  });

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast({
        title: "خطا در بارگذاری",
        description: "خطا در بارگذاری نقش‌های کاربران",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      role: 'user'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // For now, we'll work with the email directly since we can't access auth.admin
      // In production, you'd need proper admin access setup
      
      // For demonstration, we'll use a placeholder user_id
      // In production, you'd get the actual user_id from auth system
      const demoUserId = '00000000-0000-0000-0000-000000000000';

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{
          user_id: demoUserId,
          role: formData.role
        }]);

      if (error) throw error;

      toast({ 
        title: "نقش اضافه شد", 
        description: `نقش ${getRoleLabel(formData.role)} به کاربر اضافه شد` 
      });
      
      setIsAddOpen(false);
      resetForm();
      loadUserRoles();
    } catch (error) {
      console.error('Error adding user role:', error);
      toast({
        title: "خطا",
        description: "خطا در اضافه کردن نقش کاربر",
        variant: "destructive"
      });
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm('آیا از حذف این نقش اطمینان دارید؟')) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
      
      toast({ title: "حذف شد", description: "نقش کاربر با موفقیت حذف شد" });
      loadUserRoles();
    } catch (error) {
      console.error('Error removing user role:', error);
      toast({
        title: "خطا",
        description: "خطا در حذف نقش کاربر",
        variant: "destructive"
      });
    }
  };

  const getRoleLabel = (role: string) => {
    const roleObj = ROLES.find(r => r.value === role);
    return roleObj?.label || role;
  };

  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      default: return 'secondary';
    }
  };

  const filteredRoles = userRoles.filter(userRole =>
    userRole.user_id.includes(searchTerm) ||
    userRole.role.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">مدیریت کاربران</h2>
          <p className="text-muted-foreground">مدیریت نقش‌های دسترسی کاربران</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="h-4 w-4 ml-2" />
              اضافه کردن نقش
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>اضافه کردن نقش کاربر</DialogTitle>
              <DialogDescription>
                نقش جدیدی به کاربر اختصاص دهید
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>ایمیل کاربر</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>نقش</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  انصراف
                </Button>
                <Button type="submit">
                  اضافه کردن
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو کاربران..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map(role => {
          const count = userRoles.filter(ur => ur.role === role.value).length;
          return (
            <Card key={role.value}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{role.label}</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کاربر</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>تاریخ اضافه</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((userRole) => (
                <TableRow key={userRole.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {userRole.user_id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(userRole.role)}>
                      {getRoleLabel(userRole.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(userRole.created_at).toLocaleDateString('fa-IR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRole(userRole.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRoles.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              هیچ نقش کاربری یافت نشد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}