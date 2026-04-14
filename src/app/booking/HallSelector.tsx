"use client";

import { api } from "~/trpc/react";

interface Props {
  clubId: string;
  selectedHallId: string | null;
  onChange: (hallId: string) => void;
}

export default function HallSelector({ clubId, selectedHallId, onChange }: Props) {
  const { data: halls, isLoading } = api.club.getHalls.useQuery({ clubId }, { enabled: !!clubId },);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-500">Загружаем залы...</p>
      </div>
    );
  }

  if (!halls?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <p className="text-sm font-medium text-zinc-400">Выбери зал</p>
      <div className="mt-3 flex gap-3">
        {halls.map((hall) => (
          <button
            key={hall.id}
            onClick={() => onChange(hall.id)}
            className={`rounded-lg border px-5 py-3 text-sm font-medium transition-colors ${
              selectedHallId === hall.id
                ? "border-violet-500 bg-violet-600/20 text-white"
                : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {hall.name}
          </button>
        ))}
      </div>
    </div>
  );
}