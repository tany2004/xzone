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
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded text-xs font-medium transition-colors ${
        isSelected
          ? "border border-violet-500 bg-violet-600/30 text-white"
          : isAvailable
            ? isPS
              ? "border border-red-700 bg-red-950/40 text-red-300 hover:border-violet-400 hover:bg-violet-600/10 hover:text-white"
              : "border border-green-900 bg-zinc-800 text-zinc-300 hover:border-violet-400 hover:bg-violet-600/10"
            : "cursor-not-allowed border border-white/5 bg-zinc-900/50 text-zinc-700"
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
    <div className="flex items-start justify-center gap-8 overflow-x-auto pb-2">

      {/* 1 этаж */}
      <div className="shrink-0">
        <p className="mb-3 text-center text-xs font-medium text-zinc-500">1 этаж</p>
        <div className="rounded-lg border border-white/10 bg-zinc-800/30 p-4">
        {/* PS 1-6 внизу */}
          <div>
            <p className="mb-1 text-center text-[10px] text-red-500/60">PS</p>
            {row(["6", "5", "4", "3", "2", "1"], true)}
          </div> 

          {/* Разделитель — коридор */}
          <div className="my-6" />

        {/* ПК 7-14: два столбца с расстоянием */}
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
        <p className="mb-3 text-center text-xs font-medium text-zinc-500">Цоколь — Зал 1</p>
        <div className="rounded-lg border border-white/10 bg-zinc-800/30 p-4">
          <div className="flex gap-10">
            {/* Левая колонка 15-23 */}
            <div className="flex flex-col gap-1">
              {["15", "16", "17", "18", "19", "20", "21", "22", "23"].map((l) => seat(l))}
            </div>

            {/* Правая часть с расстояниями */}
            <div className="flex flex-col">
              {/* Верх: 24-26 */}
              {row(["24", "25", "26"])}

              {/* Расстояние */}
              <div className="my-14" />

              {/* Центр: 27-29 и 30-32 вплотную */}
              <div className="flex flex-col gap-1">
                {row(["27", "28", "29"])}
                {row(["30", "31", "32"])}
              </div>

              {/* Расстояние */}
              <div className="my-14.5" />

              {/* Низ: 33-35 */}
              {row(["33", "34", "35"])}
            </div>
          </div>
        </div>
      </div>

      {/* Цоколь зал 2 */}
      <div className="shrink-0">
        <p className="mb-3 text-center text-xs font-medium text-zinc-500">Цоколь — Зал 2</p>
        <div className="rounded-lg border border-white/10 bg-zinc-800/30 p-4">
          <div className="flex gap-10">
            {/* Левая колонка 36-44 */}
            <div className="flex flex-col gap-1">
              {["36", "37", "38", "39", "40", "41", "42", "43", "44"].map((l) => seat(l))}
            </div>

            {/* Правая часть */}
            <div className="flex flex-col items-end">
              {/* Верх: 45-47 */}
              {row(["45", "46", "47"])}

              {/* Расстояние */}
              <div className="my-6" />

              {/* Чуть выше центра: 48-53 вплотную */}
              <div className="flex flex-col gap-1">
                {row(["48", "49", "50"])}
                {row(["51", "52", "53"])}
              </div>

              {/* Расстояние */}
              <div className="my-6" />

              {/* Чуть ниже центра: 54-59 вплотную */}
              <div className="flex flex-col gap-1">
                {row(["54", "55", "56"])}
                {row(["57", "58", "59"])}
              </div>

              {/* Расстояние */}
              <div className="my-6" />

              {/* Низ: 60-63 */}
              {row(["60", "61", "62", "63"])}
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
    <div className="flex justify-center overflow-x-auto pb-2">
      <div className="shrink-0">
        <p className="mb-3 text-center text-xs font-medium text-zinc-500">Главный зал</p>
        <div className="rounded-lg border border-white/10 bg-zinc-800/30 p-4">
          <div className="flex gap-8">
            {/* Левый блок: 1-3 */}
            <div className="flex flex-col gap-1">
              {["1", "2", "3"].map((l) => seat(l))}
            </div>

            <div className="my-3" />

            {/* Центр: 4-13 в два столбца */}
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                {["4", "5", "6", "7", "8"].map((l) => seat(l))}
              </div>
              <div className="flex flex-col gap-1">
                {["13", "12", "11", "10", "9"].map((l) => seat(l))}
              </div>
            </div>

            <div className="my-3" />

            {/* Правый блок */}
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

          {/* Нижняя строка */}
          <div className="mt-8 flex items-center gap-8">
            {row(["25", "24", "23", "22"])}
                <div className="w-16" />
            {seat("26")}
          </div>
        </div>
      </div>
    </div>
  );
}