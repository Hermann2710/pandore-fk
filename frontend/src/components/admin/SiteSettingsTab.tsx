"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Settings,
  MapPin,
  Mail,
  Phone,
  Globe,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Link as LinkIcon,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useAdminSiteConfig,
  useUpdateSiteConfig,
  useDeleteLogo,
  useAdminSocialLinks,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
} from "@/hooks/useSiteConfig";
import type { SocialLink } from "@/types";

// ── General Settings Form ─────────────────────────────────────────────────────
function GeneralSettingsForm() {
  const { data, isLoading } = useAdminSiteConfig();
  const { mutate: update, isPending } = useUpdateSiteConfig();
  const { mutate: deleteLogo, isPending: deletingLogo } = useDeleteLogo();

  const [form, setForm] = useState({
    site_name: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    shipping_price: "",
    free_shipping_threshold: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (data)
      setForm({
        site_name: data.site_name,
        tagline: data.tagline,
        description: data.description,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        shipping_price: data.shipping_price,
        free_shipping_threshold: data.free_shipping_threshold,
      });
  }, [data]);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logoFile) fd.append("logo", logoFile);
    update(fd);
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 rounded-lg" />
        ))}
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo */}
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted border shrink-0">
          {logoPreview || data?.logo ? (
            <Image
              src={logoPreview ?? data!.logo!}
              alt="Logo"
              fill
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <div className="space-y-1.5 flex-1">
          <Label>Site Logo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setLogoFile(f);
                setLogoPreview(URL.createObjectURL(f));
              }
            }}
          />
          {data?.logo && !logoPreview && (
            <button type="button" onClick={() => deleteLogo()} disabled={deletingLogo}
              className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50">
              <Trash2 className="h-3 w-3" /> Remove current logo
            </button>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Site Name *</Label>
          <Input value={form.site_name} onChange={set("site_name")} required />
        </div>
        <div className="space-y-1.5">
          <Label>Tagline</Label>
          <Input
            value={form.tagline}
            onChange={set("tagline")}
            placeholder="Luxury Store"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={3}
            placeholder="Short description of your store…"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Mail className="h-4 w-4" /> Contact
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="contact@pandore.cm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={set("phone")}
              placeholder="+237 6XX XXX XXX"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Location
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={set("address")}
              placeholder="123 Rue de la Paix"
            />
          </div>
          <div className="space-y-1.5">
            <Label>City</Label>
            <Input
              value={form.city}
              onChange={set("city")}
              placeholder="Yaoundé"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input
              value={form.country}
              onChange={set("country")}
              placeholder="Cameroon"
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Shipping (XAF)
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Shipping Price</Label>
            <Input
              type="number"
              value={form.shipping_price}
              onChange={set("shipping_price")}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Set to 0 for always free
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Free Shipping Threshold</Label>
            <Input
              type="number"
              value={form.free_shipping_threshold}
              onChange={set("free_shipping_threshold")}
              placeholder="50000"
            />
            <p className="text-xs text-muted-foreground">
              Orders above this amount get free shipping
            </p>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="luxury"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}

// ── Social Links ──────────────────────────────────────────────────────────────
const EMPTY_SOCIAL = {
  platform: "",
  url: "",
  icon: "",
  order: 0,
  is_active: true,
};

function SocialLinkForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
}: {
  initial?: Partial<SocialLink>;
  onSubmit: (d: Partial<SocialLink>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({ ...EMPTY_SOCIAL, ...initial });
  const set =
    (k: keyof typeof EMPTY_SOCIAL) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="grid sm:grid-cols-2 gap-3 rounded-xl border bg-card p-4"
    >
      <div className="space-y-1.5">
        <Label>Platform *</Label>
        <Input
          value={form.platform}
          onChange={set("platform")}
          placeholder="Facebook"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>URL *</Label>
        <Input
          type="url"
          value={form.url}
          onChange={set("url")}
          placeholder="https://facebook.com/pandore"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>
          Icon{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (lucide name)
          </span>
        </Label>
        <Input
          value={form.icon}
          onChange={set("icon")}
          placeholder="facebook"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Order</Label>
        <Input
          type="number"
          value={form.order}
          onChange={set("order")}
          min={0}
        />
      </div>
      <div className="sm:col-span-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
          className="flex items-center gap-2 text-sm"
        >
          {form.is_active ? (
            <ToggleRight className="h-6 w-6 text-primary" />
          ) : (
            <ToggleLeft className="h-6 w-6 text-muted-foreground" />
          )}
          {form.is_active ? "Active" : "Inactive"}
        </button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="luxury" size="sm" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function SocialLinksSection() {
  const { data: links = [], isLoading } = useAdminSocialLinks();
  const { mutate: create, isPending: creating } = useCreateSocialLink();
  const { mutate: update, isPending: updating } = useUpdateSocialLink();
  const { mutate: remove } = useDeleteSocialLink();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <LinkIcon className="h-4 w-4" /> Social Networks
        </p>
        {!showForm && !editing && (
          <Button variant="luxury" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SocialLinkForm
              onSubmit={(d) =>
                create(d, { onSuccess: () => setShowForm(false) })
              }
              onCancel={() => setShowForm(false)}
              isPending={creating}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No social links yet.
        </p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div key={link.id}>
              <AnimatePresence>
                {editing?.id === link.id ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SocialLinkForm
                      initial={link}
                      onSubmit={(d) =>
                        update(
                          { id: link.id, data: d },
                          { onSuccess: () => setEditing(null) },
                        )
                      }
                      onCancel={() => setEditing(null)}
                      isPending={updating}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    layout
                    className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-primary">
                      {link.platform[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{link.platform}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                    <Badge
                      variant={link.is_active ? "emerald" : "outline"}
                      className="shrink-0"
                    >
                      {link.is_active ? "Active" : "Off"}
                    </Badge>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remove(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export default function SiteSettingsTab() {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Site Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your store identity, contact info and shipping.
          </p>
        </div>
      </div>

      <GeneralSettingsForm />

      <div className="border-t pt-8">
        <SocialLinksSection />
      </div>
    </div>
  );
}
