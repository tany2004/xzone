"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface Props {
  seatId: string;
  startsAt: Date;
  endsAt: Date;
  onSuccess: (bookingCode: string) => void;
  onBack: () => void;
}

export default function BookingForm({
  seatId,
  startsAt,
  endsAt,
  onSuccess,
  onBack,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      onSuccess(data.bookingCode);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit() {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Заполни имя и телефон");
      return;
    }
    createBooking.mutate({ seatId, startsAt, endsAt, clientName: name, clientPhone: phone });
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
      <p className="text-sm font-medium text-zinc-400">Контактные данные</p>
      <p className="mt-1 text-xs text-zinc-500">
        Нужны только для подтверждения — регистрация не требуется
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:max-w-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Имя</label>
          <input
            type="text"
            placeholder="Например, Алексей"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Телефон</label>
          <input
            type="tel"
            placeholder="+7 900 000-00-00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Назад
          </button>
          <button
            onClick={handleSubmit}
            disabled={createBooking.isPending}
            className="rounded-lg bg-violet-600 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
          >
            {createBooking.isPending ? "Бронируем..." : "Забронировать"}
          </button>
        </div>
      </div>
    </div>
  );
}