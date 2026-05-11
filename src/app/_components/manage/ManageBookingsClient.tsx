"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Club } from "@prisma/client";
import { api } from "~/trpc/react";
import { AddToBlacklistModal } from "./AddToBlacklistModal";

const statusLabel: Record<string, string> = {
  PENDING: "Ожидает",
  CONFIRMED: "Подтверждена",
  REJECTED: "Отклонена",
  CANCELLED: "Отменена",
};

const statusColor: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  CONFIRMED: "text-teal-400 bg-teal-400/10 border-teal-400/20",
  REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
  CANCELLED: "text-violet-300/40 bg-violet-300/5 border-violet-300/10",
};

interface Props {
  clubs: Club[];
  initialFilter?: string;
  initialClubId?: string;
  initialDate?: string;
  initialStatus?: string;
}

export default function ManageBookingsClient({ 
  clubs, 
  initialFilter,
  initialClubId,
  initialDate,
  initialStatus
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Устанавливаем начальные значения из URL
  const [clubId, setClubId] = useState<string>(initialClubId || "");
  const [date, setDate] = useState<string>(() => {
    // Если есть filter=today, устанавливаем сегодняшнюю дату
    if (initialFilter === "today") {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return initialDate || "";
  });
  const [status, setStatus] = useState<string>(() => {
    // Если есть filter=pending, устанавливаем статус PENDING
    if (initialFilter === "pending") {
      return "PENDING";
    }
    return initialStatus || "";
  });

  const [blacklistModal, setBlacklistModal] = useState<{
    open: boolean;
    prefill?: { clientPhone?: string; clientName?: string; bookingId?: string };
  }>({ open: false });

  const [hideBlacklisted, setHideBlacklisted] = useState(true);

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (clubId) params.set("clubId", clubId);
    if (date) params.set("date", date);
    if (status) params.set("status", status);
    
    const newUrl = `/manage/booking${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(newUrl, { scroll: false });
  }, [clubId, date, status, router]);

  const { data: bookings = [], refetch } = api.admin.getBookings.useQuery({
    clubId: clubId || undefined,
    date: date || undefined,
    status: (status || undefined) as "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | undefined,
    hideBlacklisted,
  });

  const updateStatus = api.admin.updateBookingStatus.useMutation({
    onSuccess: () => refetch(),
  });

  function formatDate(date: Date) {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Обработчик смены даты
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    // Если дата меняется вручную, убираем filter из URL
    if (newDate) {
      const params = new URLSearchParams(searchParams);
      params.delete("filter");
      router.replace(`/manage/booking${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }
  };

  // Обработчик смены статуса
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus) {
      const params = new URLSearchParams(searchParams);
      params.delete("filter");
      router.replace(`/manage/booking${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }
  };

  const selectClass =
    "rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-violet-200 focus:border-violet-500 focus:outline-none hover:border-violet-700/50 transition-colors";

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Управление
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white">Бронирования</h1>

      {/* Фильтры */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className={selectClass}
        >
          <option value="">Все клубы</option>
          {clubs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className={`${selectClass} [color-scheme:dark]`}
        />

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Все статусы</option>
          <option value="PENDING">Ожидает</option>
          <option value="CONFIRMED">Подтверждена</option>
          <option value="REJECTED">Отклонена</option>
          <option value="CANCELLED">Отменена</option>
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-violet-200 transition-colors hover:border-violet-700/50">
          <input
            type="checkbox"
            checked={hideBlacklisted}
            onChange={(e) => setHideBlacklisted(e.target.checked)}
            className="accent-violet-500"
          />
          Скрыть ЧС
        </label>

        {/* Кнопка сброса фильтров */}
        {(clubId || date || status) && (
          <button
            onClick={() => {
              setClubId("");
              setDate("");
              setStatus("");
              router.push("/manage/booking");
            }}
            className="rounded-sm border border-violet-500/20 bg-violet-500/10 px-3 py-2 text-sm text-violet-400 transition-colors hover:bg-violet-500/20"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Таблица */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-[#1e1540]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1540] bg-[#120e24]">
              {["Код", "Клуб / Место", "Время", "Клиент", "Стоимость", "Статус", "Действия"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-violet-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-violet-300/30">
                  Бронирований нет
                </td>
              </tr>
            )}
            {bookings.map((booking, i) => (
              <tr
                key={booking.id}
                className={`border-b border-[#1e1540] last:border-0 transition-colors hover:bg-violet-500/5 ${
                  i % 2 === 0 ? "bg-[#0e0b1a]" : "bg-[#120e24]"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-violet-300/60">
                  {booking.bookingCode}
                </td>
                <td className="px-4 py-3">
                  <p className="text-white">{booking.seat.hall.club.name}</p>
                  <p className="text-xs text-violet-300/40">
                    {booking.seat.hall.name} — место {booking.seat.label}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-violet-200">{formatDate(booking.startsAt)}</p>
                  <p className="text-xs text-violet-300/40">
                    до {formatDate(booking.endsAt)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-violet-200">{booking.clientName}</p>
                  <p className="text-xs text-violet-300/40">{booking.clientPhone}</p>
                </td>
                {/* Колонка со стоимостью */}
                <td className="px-4 py-3">
                  {booking.totalPrice ? (
                    <p className="font-semibold text-teal-400">{booking.totalPrice} ₽</p>
                  ) : (
                    <span className="text-xs text-violet-400/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-sm border px-2 py-0.5 text-xs font-medium ${statusColor[booking.status]}`}
                  >
                    {statusLabel[booking.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus.mutate({ bookingId: booking.id, status: "CONFIRMED" })
                          }
                          className="rounded-sm border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-xs text-teal-400 transition-colors hover:bg-teal-500/20"
                        >
                          Подтвердить
                        </button>
                      </>
                    )}
                    {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                      <button
                        onClick={() =>
                          updateStatus.mutate({ bookingId: booking.id, status: "CANCELLED" })
                        }
                        className="rounded-sm border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-xs text-violet-300/50 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
                      >
                        Отменить
                      </button>
                    )}
                    <button
                      onClick={() =>
                        setBlacklistModal({
                          open: true,
                          prefill: {
                            clientPhone: booking.clientPhone,
                            clientName: booking.clientName,
                            bookingId: booking.id,
                          },
                        })
                      }
                      className="rounded-sm border border-red-500/10 bg-red-500/5 px-2.5 py-1 text-xs text-red-400/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      В ЧС
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddToBlacklistModal
        open={blacklistModal.open}
        prefill={blacklistModal.prefill}
        onClose={() => setBlacklistModal({ open: false })}
      />
    </div>
  );
}