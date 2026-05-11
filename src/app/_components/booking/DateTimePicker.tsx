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
    <div className="rounded-sm border border-[#1e1540] bg-[#0a0814] p-6">
      <div className="space-y-3">
        <p className="text-center text-sm text-violet-200/60">Выбери дату и время</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-violet-400/50">Начало</label>
            <input
              type="datetime-local"
              min={minDate}
              value={startsAtValue}
              onChange={(e) => handleStartsAt(e.target.value)}
              className="rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-violet-400/50">Конец</label>
            <input
              type="datetime-local"
              min={startsAtValue}
              value={endsAtValue}
              onChange={(e) => handleEndsAt(e.target.value)}
              className="rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2.5 text-sm text-white [color-scheme:dark] focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}