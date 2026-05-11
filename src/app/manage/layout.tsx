"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TRPCReactProvider } from "~/trpc/react";
import AdminNavbar from "../_components/manage/AdminNavbar";
import Footer from "../_components/footer";

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена
    const checkAuth = () => {
      const hasToken = document.cookie.includes("admin_token=");
      setIsAdmin(hasToken);
      setIsLoading(false);
      
      // Если нет токена и мы не на странице логина - редирект
      if (!hasToken && pathname !== "/manage/login") {
        router.push("/manage/login");
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Пока проверяем авторизацию, показываем ничего (или лоадер)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0b1a]">
        <div className="text-violet-400">Загрузка...</div>
      </div>
    );
  }

  const isLoginPage = pathname === "/manage/login";

  return (
    <TRPCReactProvider>
      <div className="min-h-screen bg-[#0e0b1a]">
        {isAdmin && !isLoginPage && <AdminNavbar />}
        <main className={isAdmin && !isLoginPage ? "mx-auto max-w-6xl px-4 py-10" : ""}>
          {children}
        </main>
        <Footer />
      </div>
    </TRPCReactProvider>
  );
}