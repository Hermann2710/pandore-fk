"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Lock, Camera } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import AddressesTab from "@/components/profile/AddressesTab";
import ChangePasswordTab from "@/components/profile/ChangePasswordTab";

const TABS = [
  { id: "info",      label: "My Info",   icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "password",  label: "Password",  icon: Lock },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<TabId>("info");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white text-2xl font-black shadow-lg shadow-primary/30">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border shadow-sm">
            <Camera className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-sm text-muted-foreground capitalize">{user?.role} account</p>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex rounded-xl bg-muted p-1 gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === t.id && (
              <motion.div layoutId="profile-tab-bg" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
            )}
            <span className="relative flex items-center gap-2">
              <t.icon className="h-4 w-4" />{t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "info"      && <ProfileInfoTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "password"  && <ChangePasswordTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
