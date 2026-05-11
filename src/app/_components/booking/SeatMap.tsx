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
    <div className="relative overflow-hidden rounded-sm border border-[#1e1540] bg-[#0a0814] p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-violet-200/60">Карта зала</p>
        <div className="flex gap-4">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-sm ${item.color}`} />
              <span className="text-xs text-violet-400/50">{item.label}</span>
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
          <div className="h-64" />
        )}
      </div>

      {/* Оверлей */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center rounded-sm bg-[#0e0b1a]/95 backdrop-blur-sm">
          <p className="text-sm text-violet-200/60">
            Выберите клуб, дату и время
          </p>
        </div>
      )}
    </div>
  );
}

const legend = [
  { label: "Свободно", color: "border border-[#2a1f4a] bg-[#1a1435]" },
  { label: "Занято", color: "border border-[#1e1540] bg-[#0e0b1a]" },
  { label: "Выбрано", color: "border border-violet-500 bg-gradient-to-br from-violet-600/50 to-teal-600/50" },
];