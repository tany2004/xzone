"use client";

import { api } from "~/trpc/react";
import { StatsGrid } from "../_components/manage/StatsGrid";
import { QuickActions } from "../_components/manage/QuickActions";
import { SectionsGrid } from "../_components/manage/SectionsGrid";
import { RecentBookings } from "../_components/manage/RecentBookings";

export default function ManagePage() {
  const { data: stats, isLoading } = api.admin.getDashboardStats.useQuery();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Панель управления
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white">Добро пожаловать</h1>
      <p className="mt-2 text-sm text-violet-200/50">
        Управляй клубом в одном месте
      </p>

      {/* Статистика */}
      {stats && !isLoading && <StatsGrid stats={stats} />}

      {/* Быстрые действия */}
      <QuickActions />

      {/* Основные разделы */}
      <SectionsGrid />

      {/* Последние бронирования */}
      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <RecentBookings bookings={stats.recentBookings} />
      )}
    </div>
  );
}