"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, Truck, User as UserIcon, Crown, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/useAdminUsers";
import { useAuth } from "@/context/AuthContext";
import type { User } from "@/types";

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  admin:    { label: "Admin",    icon: Crown,    color: "text-amber-600",   bg: "bg-amber-50" },
  delivery: { label: "Delivery", icon: Truck,    color: "text-blue-600",    bg: "bg-blue-50" },
  customer: { label: "Customer", icon: UserIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
};

function RoleEditDialog({ user, currentAdminId }: { user: User; currentAdminId: number | undefined }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(user.role);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isActive, setIsActive] = useState(user.is_active);
  const { mutate, isPending } = useUpdateUserRole();
  const isSelf = currentAdminId === user.id;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5 h-8"><ShieldCheck className="h-3.5 w-3.5" /> Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit — {user.username}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as User["role"])} disabled={isSelf}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {isSelf && <p className="text-xs text-muted-foreground">You cannot change your own role.</p>}
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+237 6 00 00 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsActive((v) => !v)} className="text-primary">
              {isActive ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
            </button>
            <span className="text-sm font-medium">{isActive ? "Account active" : "Account disabled"}</span>
          </div>
          <Button variant="luxury" className="w-full" disabled={isPending}
            onClick={() => mutate({ id: user.id, data: { role, phone, is_active: isActive } }, { onSuccess: () => setOpen(false) })}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersTab() {
  const { user: currentAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const filtered = users?.filter((u) => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (roleFilter === "all" || u.role === roleFilter);
  });

  const counts = {
    all:      users?.length ?? 0,
    admin:    users?.filter((u) => u.role === "admin").length ?? 0,
    delivery: users?.filter((u) => u.role === "delivery").length ?? 0,
    customer: users?.filter((u) => u.role === "customer").length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by username or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "delivery", "customer"] as const).map((r) => (
            <Button key={r} size="sm" variant={roleFilter === r ? "default" : "outline"} onClick={() => setRoleFilter(r)} className="capitalize gap-1.5">
              {r !== "all" && (() => { const cfg = ROLE_CONFIG[r]; return <cfg.icon className="h-3.5 w-3.5" />; })()}
              {r} <span className="text-xs opacity-70">({counts[r]})</span>
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{["User", "Email", "Phone", "Role", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered?.map((user, i) => {
                  const cfg = ROLE_CONFIG[user.role];
                  const isSelf = currentAdmin?.id === user.id;
                  return (
                    <motion.tr key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${cfg.bg} ${cfg.color} shrink-0`}><cfg.icon className="h-4 w-4" /></div>
                          <p className="font-medium">{user.username}{isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon className="h-3 w-3" />{cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(user.date_joined).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RoleEditDialog user={user} currentAdminId={currentAdmin?.id} />
                          {!isSelf && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => { if (confirm(`Delete "${user.username}"?`)) deleteUser(user.id); }}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered?.length === 0 && <p className="text-center py-12 text-muted-foreground">No users found</p>}
        </div>
      )}
    </div>
  );
}
