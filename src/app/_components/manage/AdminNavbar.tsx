"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/manage", label: "Главная" },
  { href: "/manage/booking", label: "Бронирования" },
  { href: "/manage/pricing", label: "Прайс" },
  { href: "/manage/seats", label: "Места" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/manage/logout", {
        method: "POST",
      });
      
      if (response.ok) {
        // Принудительно обновляем страницу после выхода
        window.location.href = "/manage/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <header className="border-b border-[#1e1540] bg-[#0e0b1a] sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-stretch h-[58px]">
          {/* Логотип */}
          <Link href="/manage" className="flex items-center gap-2.5 px-5 border-r border-[#1e1540] min-w-[160px]">
            <div className="w-9 h-9 bg-violet-800 rounded flex items-center justify-center p-1.5">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <rect x="3" y="3" width="8" height="8" rx="1" fill="#c4b5fd"/>
                <rect x="13" y="3" width="8" height="8" rx="1" fill="#5b21b6"/>
                <rect x="3" y="13" width="8" height="8" rx="1" fill="#5b21b6"/>
                <rect x="13" y="13" width="8" height="8" rx="1" fill="#2dd4bf"/>
              </svg>
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="text-white text-[17px] font-bold tracking-wide">XZone</span>
              <span className="text-violet-700 text-[9px] tracking-[3px] uppercase">admin</span>
            </div>
          </Link>

          {/* Ссылки */}
          <nav className="flex items-stretch flex-1 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-3.5 text-[13px] border-b-2 transition-colors ${
                  pathname === link.href
                    ? "text-white border-teal-400"
                    : "text-violet-300 border-transparent hover:text-white hover:border-violet-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Кнопка выхода */}
          <div className="flex items-center px-4 border-l border-[#1e1540]">
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="relative overflow-hidden text-white text-[11px] font-bold tracking-[2px] uppercase px-5 py-2.5 rounded-sm transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 group"
              style={{background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)"}}
            >
              <span className="relative z-10">
                {isLoggingOut ? "Выход..." : "Выйти"}
              </span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)"}}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Модальное окно подтверждения выхода */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="rounded-sm border border-[#1e1540] bg-[#0a0814] p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-white">Выйти из аккаунта?</h3>
            <p className="mt-2 text-sm text-violet-200/60">
              Вы уверены, что хотите выйти из панели управления?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 rounded-sm bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.02]"
              >
                Выйти
              </button>
              <button
                onClick={handleCancelLogout}
                className="flex-1 rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/10"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}