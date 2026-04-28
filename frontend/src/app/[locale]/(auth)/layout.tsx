import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import AuthMobileLogo from "@/components/auth/AuthMobileLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandPanel />

      <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12">
        <AuthMobileLogo />
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
