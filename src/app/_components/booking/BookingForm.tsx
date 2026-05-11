"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface BookingFormProps {
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
}: BookingFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: priceInfo, isLoading: isPriceLoading } = api.pricing.calculatePrice.useQuery({
    seatId,
    startsAt,
    endsAt,
  });

  const { data: blacklistCheck } = api.booking.checkPhone.useQuery(
    { phone: clientPhone.trim() },
    { enabled: clientPhone.trim().length >= 7 }
  );
  const isBlacklisted = blacklistCheck?.isBlacklisted ?? false;

  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      onSuccess(data.bookingCode);
    },
    onError: (error) => {
      setError(error.message || "Ошибка при создании бронирования");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isBlacklisted) return;

    if (!clientName.trim()) {
      setError("Введите ваше имя");
      return;
    }

    if (!clientPhone.trim()) {
      setError("Введите ваш телефон");
      return;
    }

    createBooking.mutate({
      seatId,
      startsAt,
      endsAt,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPeriodLabel = (period: string, isPackage: boolean) => {
    const labels: Record<string, string> = {
      MORNING: "Утро (08:00-12:00)",
      DAY: "День (12:00-17:00)",
      EVENING: "Вечер (17:00-08:00)",
      PACK_3H: "Пакет 3 часа",
      PACK_5H: "Пакет 5 часов",
      NIGHT_WEEKDAY: "Ночной пакет (будни)",
      NIGHT_WEEKEND: "Ночной пакет (выходные)",
      HOURLY: "Почасовой тариф",
    };
    return labels[period] || period;
  };

  return (
    <div className="mt-8 rounded-sm border border-[#1e1540] bg-[#120e24] p-6">
      <h2 className="text-xl font-bold text-white mb-4">Информация о бронировании</h2>

      {/* Информация о цене */}
      <div className="mb-6 rounded-sm border border-teal-500/20 bg-teal-500/5 p-4">
        <h3 className="text-sm font-semibold text-teal-400 mb-2">Детали заказа</h3>
        
        {isPriceLoading ? (
          <p className="text-sm text-violet-400/60">Расчет стоимости...</p>
        ) : priceInfo ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-violet-400/60">Время бронирования:</span>
              <span className="text-white">
                {formatDate(startsAt)} — {formatDate(endsAt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-400/60">Длительность:</span>
              <span className="text-white">{priceInfo.durationHours} ч</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-violet-400/60">Тариф:</span>
              <span className="text-white">
                {getPeriodLabel(priceInfo.period, priceInfo.isPackage)}
              </span>
            </div>
            {!priceInfo.isPackage && priceInfo.pricePerHour && (
              <div className="flex justify-between text-sm">
                <span className="text-violet-400/60">Цена за час:</span>
                <span className="text-white">{priceInfo.pricePerHour} ₽/ч</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-teal-500/20">
              <span className="text-teal-400">Итого:</span>
              <span className="text-teal-400">{priceInfo.total} ₽</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-red-400">Не удалось рассчитать стоимость</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-violet-400 mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-sm border border-[#1e1540] bg-[#0e0b1a] px-4 py-2.5 text-sm text-white placeholder:text-violet-700/50 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
            placeholder="Введите ваше имя"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-violet-400 mb-1">
            Номер телефона
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className={`w-full rounded-sm border bg-[#0e0b1a] px-4 py-2.5 text-sm text-white placeholder:text-violet-700/50 focus:outline-none focus:ring-1 transition-colors ${
              isBlacklisted
                ? "border-red-700/50 focus:border-red-700/50 focus:ring-red-700/50"
                : "border-[#1e1540] focus:border-teal-500/50 focus:ring-teal-500/50"
            }`}
            placeholder="+7 (XXX) XXX-XX-XX"
            required
          />
        </div>

        {/* Баннер чёрного списка */}
        {isBlacklisted && (
          <div className="rounded-sm border border-red-700/50 bg-red-950/20 p-4">
            <p className="text-sm font-semibold text-red-400 mb-1">
              Бронирование недоступно
            </p>
            <p className="text-sm text-red-400/70">
              Ваш номер телефона находится в чёрном списке клуба. Если вы считаете
              это ошибкой или хотите уточнить детали, пожалуйста, свяжитесь с
              администратором клуба напрямую.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-sm border border-red-700/50 bg-red-950/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-sm border border-[#1e1540] bg-[#0e0b1a] px-6 py-2.5 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-500/10"
          >
            Назад
          </button>
          <button
            type="submit"
            disabled={createBooking.isPending || !priceInfo || isBlacklisted}
            className="relative flex-1 overflow-hidden rounded-sm px-6 py-2.5 text-sm font-bold uppercase tracking-[2px] text-white transition-all duration-300 hover:scale-105 hover:brightness-125 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
            style={{ background: "linear-gradient(90deg, #7c3aed 0%, #0d9488 100%)" }}
          >
            <span className="relative z-10">
              {createBooking.isPending ? "Бронируем..." : `Забронировать за ${priceInfo?.total || 0} ₽`}
            </span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)" }}
            />
          </button>
        </div>
      </form>

      {priceInfo?.isPackage && priceInfo.period.includes("NIGHT") && (
        <div className="mt-4 rounded-sm border border-amber-500/20 bg-amber-500/5 p-3">
          <p className="text-xs text-amber-400/80">
            💡 Ночной пакет действует с 21:00 до 07:30. В него уже включены все часы.
          </p>
        </div>
      )}
    </div>
  );
}