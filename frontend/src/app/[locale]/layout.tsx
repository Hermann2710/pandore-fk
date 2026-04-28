import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import QueryProvider from "@/components/layout/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "bg-card border border-border text-foreground shadow-lg",
              success: "border-emerald-200",
              error: "border-red-200",
            },
          }}
        />
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
