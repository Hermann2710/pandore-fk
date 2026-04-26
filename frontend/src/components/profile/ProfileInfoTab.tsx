"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfile";

export default function ProfileInfoTab() {
  const { user } = useAuth();
  const { mutate: update, isPending } = useUpdateProfile();

  const [form, setForm] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("username", form.username);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    if (avatarFile) fd.append("avatar", avatarFile);
    update(fd);
  };

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar upload */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl overflow-hidden bg-muted border">
                {avatarPreview || user?.avatar ? (
                  <Image
                    src={avatarPreview ?? user!.avatar!}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl font-black text-muted-foreground">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-emerald-700 transition-colors">
                <Camera className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {user?.role}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Member since{" "}
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={form.username}
                onChange={set("username")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="phone">
                Phone{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                id="phone"
                placeholder="+1 555 0100"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" variant="luxury" disabled={isPending}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
