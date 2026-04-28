"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { User, MapPin, Lock, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import AddressesTab from "@/components/profile/AddressesTab";
import ChangePasswordTab from "@/components/profile/ChangePasswordTab";
import NewsletterTab from "@/components/profile/NewsletterTab";

type TabId = "info" | "addresses" | "password" | "newsletter";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tc = useTranslations("catalog");
  const { user } = useAuth();
  const [tab, setTab] = useState<TabId>("info");

  const TABS = [
    { id: "info" as TabId, label: t("tabs.info"), icon: User },
    { id: "addresses" as TabId, label: t("tabs.addresses"), icon: MapPin },
    { id: "password" as TabId, label: t("tabs.password"), icon: Lock },
    { id: "newsletter" as TabId, label: t("tabs.newsletter"), icon: Bell },
  ];

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `http://localhost:8000${user.avatar}`
    : null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5"
      >
        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-primary shadow-lg shadow-primary/30 shrink-0">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={tc("avatarAlt")} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-black text-white">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-sm text-muted-foreground">
            {t("account", { role: user?.role ?? "" })}
          </p>
        </div>
      </motion.div>

      <div className="flex rounded-xl bg-muted p-1 gap-1">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === tb.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === tb.id && (
              <motion.div
                layoutId="profile-tab-bg"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <tb.icon className="h-4 w-4" />
              {tb.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "info" && <ProfileInfoTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "password" && <ChangePasswordTab />}
          {tab === "newsletter" && <NewsletterTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
