"use client";

import { useState } from "react";
import type { Club } from "@prisma/client";
import { api } from "~/trpc/react";
import { X, MapPin, Grid3x3, Plus, Trash2 } from "lucide-react";

interface Props {
  clubs: Club[];
}

export default function ManageSeatsClient({ clubs }: Props) {
  const [clubId, setClubId] = useState<string>(clubs[0]?.id ?? "");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: seats = [], refetch } = api.admin.getSeats.useQuery(
    { clubId },
    { enabled: !!clubId },
  );

  const toggleBlock = api.admin.toggleSeatBlock.useMutation({
    onSuccess: () => refetch(),
  });

  const addSeat = api.admin.addSeat.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteSeat = api.admin.deleteSeat.useMutation({
    onSuccess: () => {
      setDeleteError(null);
      void refetch();
    },
    onError: (e) => setDeleteError(e.message),
  });

  // Группируем по залам
  const hallMap = seats.reduce<Record<string, { hallName: string; hallId: string; seats: typeof seats }>>((acc, seat) => {
    const key = seat.hallId;
    if (!acc[key]) {
      acc[key] = { hallName: seat.hall.name, hallId: seat.hallId, seats: [] };
    }
    acc[key].seats.push(seat);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Управление
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white">Места</h1>
      <p className="mt-2 text-sm text-violet-200/50">
        Нажми на место чтобы заблокировать. Удаление доступно только для мест без активных броней.
      </p>

      {/* Переключатель клуба */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <p className="text-sm text-violet-200/60">Выбери клуб</p>
        <div className="flex rounded-sm border border-[#1e1540] bg-[#120e24]">
          {clubs.map((club) => (
            <button
              key={club.id}
              onClick={() => setClubId(club.id)}
              className={`rounded-sm px-5 py-2.5 text-sm font-medium transition-all ${
                clubId === club.id
                  ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "text-violet-400/60 hover:text-violet-400"
              }`}
            >
              {club.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ошибка удаления */}
      {deleteError && (
        <div className="mt-6 rounded-sm border border-red-700/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {deleteError}
        </div>
      )}

      {/* Залы и места */}
      <div className="mt-10 space-y-10">
        {Object.values(hallMap).map(({ hallName, hallId, seats: hallSeats }) => (
          <div key={hallId}>
            {/* Заголовок зала */}
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-500" />
              <p className="text-sm font-medium text-white">{hallName}</p>
              <div className="h-px flex-1 bg-gradient-to-r from-[#1e1540] to-transparent" />
              <span className="text-xs text-violet-400/40">{hallSeats.length} мест</span>
            </div>

            {/* Сетка мест */}
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14">
              {hallSeats.map((seat) => (
                <div key={seat.id} className="group relative">
                  {/* Кнопка удаления — появляется при наведении */}
                  <button
                    onClick={() => deleteSeat.mutate({ seatId: seat.id })}
                    title="Удалить место"
                    className="absolute -right-1.5 -top-1.5 z-10 hidden h-4 w-4 items-center justify-center rounded-sm border border-red-700/50 bg-red-950 text-red-400 transition-colors hover:bg-red-900 group-hover:flex"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>

                  <button
                    onClick={() => toggleBlock.mutate({ seatId: seat.id })}
                    title={seat.isBlocked ? "Разблокировать" : "Заблокировать"}
                    className={`flex h-12 w-12 items-center justify-center rounded-sm text-sm font-medium transition-all duration-200 ${
                      seat.isBlocked
                        ? "border border-red-700/50 bg-gradient-to-br from-red-950/40 to-red-900/20 text-red-400 hover:border-red-500"
                        : "border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] text-violet-300/80 hover:border-teal-500/50 hover:text-teal-400"
                    }`}
                  >
                    {seat.label}
                    {seat.isBlocked && (
                      <div className="absolute -right-1 -top-1">
                        <X className="h-3 w-3 text-red-400" />
                      </div>
                    )}
                  </button>
                </div>
              ))}

              {/* Кнопка добавления места */}
              <button
                onClick={() => addSeat.mutate({ hallId })}
                disabled={addSeat.isPending}
                title="Добавить место"
                className="flex h-12 w-12 items-center justify-center rounded-sm border border-dashed border-violet-700/30 text-violet-700/40 transition-all hover:border-violet-500/60 hover:text-violet-400 disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="mt-12 flex flex-wrap gap-6 rounded-sm border border-[#1e1540] bg-[#120e24]/50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a]" />
          <span className="text-xs text-violet-400/60">Доступно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm border border-red-700/50 bg-gradient-to-br from-red-950/40 to-red-900/20" />
          <span className="text-xs text-violet-400/60">Заблокировано</span>
        </div>
        <div className="flex items-center gap-2">
          <Trash2 className="h-3 w-3 text-red-400/60" />
          <span className="text-xs text-violet-400/60">Наведи на место чтобы удалить</span>
        </div>
        <div className="flex items-center gap-2">
          <Plus className="h-3 w-3 text-violet-400/60" />
          <span className="text-xs text-violet-400/60">Добавить место в конец зала</span>
        </div>
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-3 w-3 text-teal-500" />
          <span className="text-xs text-violet-400/60">Нажми на место чтобы заблокировать</span>
        </div>
      </div>

      {/* Статистика */}
      {seats.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-violet-400/40">
          <span>Всего мест: {seats.length}</span>
          <span>•</span>
          <span className="text-teal-400/60">Доступно: {seats.filter(s => !s.isBlocked).length}</span>
          <span>•</span>
          <span className="text-red-400/60">Заблокировано: {seats.filter(s => s.isBlocked).length}</span>
        </div>
      )}
    </div>
  );
}