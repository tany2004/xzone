"use client";

interface Props {
  startsAt: Date | null;
  endsAt: Date | null;
  onChangeStartsAt: (date: Date) => void;
  onChangeEndsAt: (date: Date) => void;
}

export default function DateTimePicker({
  startsAt,
  endsAt,
  onChangeStartsAt,
  onChangeEndsAt,
}: Props) {
  const now = new Date();
  // Минимальная дата — сегодня
  const minDate = now.toISOString().slice(0, 16);

  function handleStartsAt(value: string) {
    const date = new Date(value);
    onChangeStartsAt(date);
    // Автоматически ставим конец через 2 часа
    const end = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    onChangeEndsAt(end);
  }

  function handleEndsAt(value: string) {
    onChangeEndsAt(new Date(value));
  }

  const endsAtValue = endsAt
    ? new Date(endsAt.getTime() - endsAt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

  const startsAtValue = startsAt
    ? new Date(startsAt.getTime() - startsAt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <p className="text-sm font-medium text-zinc-400">Дата и время</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-zinc-500">Начало</label>
          <input
            type="datetime-local"
            min={minDate}
            value={startsAtValue}
            onChange={(e) => handleStartsAt(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:border-violet-500 focus:outline-none"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label className="text-xs text-zinc-500">Конец</label>
          <input
            type="datetime-local"
            min={startsAtValue}
            value={endsAtValue}
            onChange={(e) => handleEndsAt(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:border-violet-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}