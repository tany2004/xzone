'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loginMutation = api.admin.login.useMutation({
    onSuccess: (data) => {
      // Устанавливаем токен в cookie
      document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 8}`;
      // Полная перезагрузка страницы после логина
      window.location.href = '/manage';
    },
    onError: (error) => {
      setError(error.message || 'Неверный логин или пароль');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ login, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "#0e0b1a" }}>
      <div className="w-full max-w-sm rounded-sm border border-[#1e1540] bg-[#0a0814] p-8">
        <div className="w-16 h-[2px] bg-gradient-to-r from-violet-500 to-teal-500 mb-6" />
        
        <h1 className="text-2xl font-bold text-white">Вход</h1>
        <p className="mt-1 text-sm text-violet-200/60">Панель управления XZone</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-violet-400/50">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2.5 text-sm text-white placeholder:text-violet-700/50 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              placeholder="Введите логин"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-violet-400/50">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2.5 text-sm text-white placeholder:text-violet-700/50 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="relative mt-2 overflow-hidden rounded-sm py-2.5 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 group"
            style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
          >
            <span className="relative z-10">
              {loginMutation.isPending ? "Входим..." : "Войти"}
            </span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
            />
          </button>
        </form>
      </div>
    </div>
  );
}