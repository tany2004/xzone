"use client";

import { api } from "~/trpc/react";

interface MapProps {
  clubId: string;
  startsAt: Date;
  endsAt: Date;
  selectedSeatId: string | null;
  onSelect: (seatId: string) => void;
}

function useSeatMap(clubId: string, startsAt: Date, endsAt: Date) {
  const { data: seats = [] } = api.club.getSeatsForClub.useQuery(
    { clubId, startsAt, endsAt },
    { enabled: !!clubId },
  );
  function getSeat(label: string) {
    return seats.find((s) => s.label === label);
  }
  return { getSeat };
}

interface SeatBoxProps {
  label: string;
  seatId: string | undefined;
  isAvailable: boolean;
  isSelected: boolean;
  isPS?: boolean;
  onSelect: (id: string) => void;
}

function SeatBox({ label, seatId, isAvailable, isSelected, isPS, onSelect }: SeatBoxProps) {
  return (
    <button
      disabled={!isAvailable || !seatId}
      onClick={() => seatId && isAvailable && onSelect(seatId)}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-xs font-medium transition-all duration-200 ${
        isSelected
          ? "border border-violet-500 bg-gradient-to-br from-violet-600/50 to-teal-600/50 text-white shadow-lg shadow-violet-500/25"
          : isAvailable
            ? isPS
              ? "border border-red-700/50 bg-red-950/50 text-red-300 hover:border-violet-500 hover:bg-violet-600/20 hover:text-white"
              : "border border-[#2a1f4a] bg-[#1a1435] text-violet-200/70 hover:border-violet-500 hover:bg-violet-600/20 hover:text-white"
            : "cursor-not-allowed border border-[#1e1540] bg-[#0e0b1a] text-violet-700/40"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Карта Циолковского ───────────────────────────────────────────

export function CiolkovskogoMap({ clubId, startsAt, endsAt, selectedSeatId, onSelect }: MapProps) {
  const { getSeat } = useSeatMap(clubId, startsAt, endsAt);

  function seat(label: string, isPS = false) {
    const s = getSeat(label);
    return (
      <SeatBox
        key={label}
        label={label}
        seatId={s?.id}
        isAvailable={s?.isAvailable ?? false}
        isSelected={selectedSeatId === s?.id}
        isPS={isPS}
        onSelect={onSelect}
      />
    );
  }

  function row(labels: string[], isPS = false) {
    return (
      <div className="flex gap-1">
        {labels.map((l) => seat(l, isPS))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-violet-200/60">Выбери место на карте</p>
      <div className="flex items-start justify-center gap-8 overflow-x-auto pb-2">
        {/* 1 этаж */}
        <div className="shrink-0">
          <p className="mb-3 text-center text-xs font-medium text-teal-500">1 этаж</p>
          <div className="rounded-sm border border-[#1e1540] bg-[#120e24]/50 p-4">
            <div>
              <p className="mb-1 text-center text-[10px] text-red-500/60">PS</p>
              {row(["6", "5", "4", "3", "2", "1"], true)}
            </div>
            <div className="my-6" />
            <div className="flex gap-8">
              <div className="flex flex-col gap-1">
                {["14", "13", "12", "11"].map((l) => seat(l))}
              </div>
              <div className="flex flex-col gap-1">
                {["7", "8", "9", "10"].map((l) => seat(l))}
              </div>
            </div>
          </div>
        </div>

        {/* Цоколь зал 1 */}
        <div className="shrink-0">
          <p className="mb-3 text-center text-xs font-medium text-teal-500">Цоколь — Зал 1</p>
          <div className="rounded-sm border border-[#1e1540] bg-[#120e24]/50 p-4">
            <div className="flex gap-10">
              <div className="flex flex-col gap-1">
                {["15", "16", "17", "18", "19", "20", "21", "22", "23"].map((l) => seat(l))}
              </div>
              <div className="flex flex-col">
                {row(["24", "25", "26"])}
                <div className="my-14" />
                <div className="flex flex-col gap-1">
                  {row(["27", "28", "29"])}
                  {row(["30", "31", "32"])}
                </div>
                <div className="my-14.5" />
                {row(["33", "34", "35"])}
              </div>
            </div>
          </div>
        </div>

        {/* Цоколь зал 2 */}
        <div className="shrink-0">
          <p className="mb-3 text-center text-xs font-medium text-teal-500">Цоколь — Зал 2</p>
          <div className="rounded-sm border border-[#1e1540] bg-[#120e24]/50 p-4">
            <div className="flex gap-10">
              <div className="flex flex-col gap-1">
                {["36", "37", "38", "39", "40", "41", "42", "43", "44"].map((l) => seat(l))}
              </div>
              <div className="flex flex-col items-end">
                {row(["45", "46", "47"])}
                <div className="my-6" />
                <div className="flex flex-col gap-1">
                  {row(["48", "49", "50"])}
                  {row(["51", "52", "53"])}
                </div>
                <div className="my-6" />
                <div className="flex flex-col gap-1">
                  {row(["54", "55", "56"])}
                  {row(["57", "58", "59"])}
                </div>
                <div className="my-6" />
                {row(["60", "61", "62", "63"])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Карта Серова ─────────────────────────────────────────────────

export function SerovaMap({ clubId, startsAt, endsAt, selectedSeatId, onSelect }: MapProps) {
  const { getSeat } = useSeatMap(clubId, startsAt, endsAt);

  function seat(label: string) {
    const s = getSeat(label);
    return (
      <SeatBox
        key={label}
        label={label}
        seatId={s?.id}
        isAvailable={s?.isAvailable ?? false}
        isSelected={selectedSeatId === s?.id}
        onSelect={onSelect}
      />
    );
  }

  function row(labels: string[]) {
    return <div className="flex gap-1">{labels.map((l) => seat(l))}</div>;
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-violet-200/60">Выбери место на карте</p>
      <div className="flex justify-center overflow-x-auto pb-2">
        <div className="shrink-0">
          <p className="mb-3 text-center text-xs font-medium text-teal-500">Главный зал</p>
          <div className="rounded-sm border border-[#1e1540] bg-[#120e24]/50 p-4">
            <div className="flex gap-8">
              <div className="flex flex-col gap-1">
                {["1", "2", "3"].map((l) => seat(l))}
              </div>
              <div className="my-3" />
              <div className="flex gap-1">
                <div className="flex flex-col gap-1">
                  {["4", "5", "6", "7", "8"].map((l) => seat(l))}
                </div>
                <div className="flex flex-col gap-1">
                  {["13", "12", "11", "10", "9"].map((l) => seat(l))}
                </div>
              </div>
              <div className="my-3" />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  {row(["15", "14"])}
                  {row(["16", "17"])}
                </div>
                <div className="my-3" />
                <div className="flex flex-col gap-1">
                  {row(["19", "18"])}
                  {row(["20", "21"])}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-8">
              {row(["25", "24", "23", "22"])}
              <div className="w-16" />
              {seat("26")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}