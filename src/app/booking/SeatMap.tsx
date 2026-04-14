"use client";

import type { Club } from "@prisma/client";
import { CiolkovskogoMap, SerovaMap } from "./ClubMaps";

interface Props {
  clubs: Club[];
  selectedClubId: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  selectedSeatId: string | null;
  isReady: boolean;
  onSelect: (seatId: string) => void;
}

export default function SeatMap({
  clubs,
  selectedClubId,
  startsAt,
  endsAt,
  selectedSeatId,
  isReady,
  onSelect,
}: Props) {
  const selectedClub = clubs.find((c) => c.id === selectedClubId);
  const isCiolkovskogo = selectedClub?.name.toLowerCase().includes("циол");

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">Карта зала</p>
        <div className="flex gap-4">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-sm ${item.color}`} />
              <span className="text-xs text-zinc-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isReady && selectedClubId && startsAt && endsAt ? (
          isCiolkovskogo ? (
            <CiolkovskogoMap
              clubId={selectedClubId}
              startsAt={startsAt}
              endsAt={endsAt}
              selectedSeatId={selectedSeatId}
              onSelect={onSelect}
            />
          ) : (
            <SerovaMap
              clubId={selectedClubId}
              startsAt={startsAt}
              endsAt={endsAt}
              selectedSeatId={selectedSeatId}
              onSelect={onSelect}
            />
          )
        ) : (
          // Заглушка пока не всё выбрано — чтобы карта имела размер
          <div className="h-64" />
        )}
      </div>

      {/* Оверлей */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/80 backdrop-blur-sm">
          <p className="text-sm text-zinc-400">
            Выберите клуб, дату и время
          </p>
        </div>
      )}
    </div>
  );
}

const legend = [
  { label: "Свободно", color: "bg-zinc-700 border border-green-900" },
  { label: "Занято", color: "bg-zinc-900 border border-white/5" },
  { label: "Выбрано", color: "bg-violet-600/30 border border-violet-500" },
];