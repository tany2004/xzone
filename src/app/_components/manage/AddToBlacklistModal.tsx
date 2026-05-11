"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

// ─── типы ────────────────────────────────────────────────────────────────────

interface AddToBlacklistModalProps {
  /** Открыт ли модал */
  open: boolean;
  onClose: () => void;
  /** Предзаполнить данные из брони */
  prefill?: {
    clientPhone?: string;
    clientName?: string;
    bookingId?: string;
  };
  /** Коллбэк после успешного добавления */
  onSuccess?: () => void;
}

// ─── компонент ───────────────────────────────────────────────────────────────

export function AddToBlacklistModal({
  open,
  onClose,
  prefill,
  onSuccess,
}: AddToBlacklistModalProps) {
  const [phone, setPhone] = useState(prefill?.clientPhone ?? "");
  const [name, setName] = useState(prefill?.clientName ?? "");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Синхронизируем prefill при открытии
  useEffect(() => {
    if (open) {
      setPhone(prefill?.clientPhone ?? "");
      setName(prefill?.clientName ?? "");
      setReason("");
      setError(null);
      setShowConfirm(false);
    }
  }, [open, prefill]);

  // Проверяем, есть ли уже в ЧС
  const { data: checkData } = api.blacklist.checkPhone.useQuery(
    { phone },
    { enabled: phone.length >= 7 }
  );
  const alreadyBlacklisted = checkData?.isBlacklisted;

  const [noShowCount, setNoShowCount] = useState(1);

  // Сбрасывай при открытии:
  useEffect(() => {
    if (open) {
      setPhone(prefill?.clientPhone ?? "");
      setName(prefill?.clientName ?? "");
      setReason("");
      setNoShowCount(1); // ← добавить
      setError(null);
      setShowConfirm(false);
    }
  }, [open, prefill]);

  const utils = api.useUtils();

  const addMutation = api.blacklist.addOrIncrement.useMutation({
    onSuccess: () => {
      void utils.blacklist.getAll.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (e) => setError(e.message),
  });

  const addFromBookingMutation = api.blacklist.addFromBooking.useMutation({
    onSuccess: () => {
      void utils.blacklist.getAll.invalidate();
      onSuccess?.();
      onClose();
    },
    onError: (e) => setError(e.message),
  });

  const isLoading = addMutation.isPending || addFromBookingMutation.isPending;

  function handleSubmit() {
    setError(null);
    if (!phone.trim() || phone.length < 7) {
      setError("Введите корректный номер телефона");
      return;
    }
    if (!name.trim() || name.length < 2) {
      setError("Введите имя клиента");
      return;
    }

    // Если уже в списке — показываем подтверждение (счётчик++)
    if (alreadyBlacklisted && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (prefill?.bookingId) {
      addFromBookingMutation.mutate({ bookingId: prefill.bookingId, reason: reason || undefined, noShowCount });
    } else {
      addMutation.mutate({ clientPhone: phone, clientName: name, reason: reason || undefined, noShowCount });
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Оверлей */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Модальное окно */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
        style={{ fontFamily: "Geist, sans-serif" }}
      >
        <div
          className="relative border"
          style={{
            background: "#120e24",
            borderColor: "#1e1540",
            borderRadius: "2px",
          }}
        >
          {/* Шапка */}
          <div
            className="flex items-center justify-between border-b px-6 py-4"
            style={{ borderColor: "#1e1540" }}
          >
            <div>
              <p
                className="mb-1 text-xs uppercase tracking-[2px]"
                style={{ color: "#2dd4bf" }}
              >
                Администрирование
              </p>
              <h2 className="text-base font-bold text-white">
                Добавить в чёрный список
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-lg transition-colors"
              style={{ color: "rgba(196,181,253,0.4)" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "rgba(196,181,253,0.9)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "rgba(196,181,253,0.4)")
              }
            >
              ×
            </button>
          </div>

          {/* Контент */}
          <div className="px-6 py-5 space-y-4">
            {/* Уже в ЧС — баннер */}
            {alreadyBlacklisted && (
              <div
                className="border px-4 py-3 text-sm"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  borderColor: "rgba(124,58,237,0.4)",
                  borderRadius: "2px",
                  color: "#c4b5fd",
                }}
              >
                <span className="font-semibold text-white">
                  Клиент уже в чёрном списке.
                </span>{" "}
                Повторное добавление увеличит счётчик неявок (сейчас:{" "}
                <span style={{ color: "#2dd4bf" }}>
                  {checkData?.entry?.noShowCount}
                </span>
                ).
              </div>
            )}

            {/* Телефон */}
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[2px]" style={{ color: "#2dd4bf" }}>
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setShowConfirm(false);
                  setError(null);
                }}
                placeholder="+7 999 000 00 00"
                disabled={!!prefill?.bookingId}
                className="w-full border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:opacity-30 disabled:opacity-50"
                style={{
                  borderColor: "#1e1540",
                  borderRadius: "2px",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1540")}
              />
            </div>

            {/* Имя */}
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[2px]" style={{ color: "#2dd4bf" }}>
                Имя клиента
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                disabled={!!prefill?.bookingId}
                className="w-full border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:opacity-30 disabled:opacity-50"
                style={{
                  borderColor: "#1e1540",
                  borderRadius: "2px",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1540")}
              />
            </div>

            {/* Причина */}
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[2px]" style={{ color: "#2dd4bf" }}>
                Причина{" "}
                <span style={{ color: "rgba(196,181,253,0.4)", textTransform: "none", letterSpacing: 0 }}>
                  (необязательно)
                </span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Не явился 3 раза без предупреждения..."
                rows={3}
                className="w-full resize-none border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:opacity-30"
                style={{
                  borderColor: "#1e1540",
                  borderRadius: "2px",
                  color: "rgba(237,233,254,0.85)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1540")}
              />
            </div>
            {/* Количество неявок */}
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-[2px]" style={{ color: "#2dd4bf" }}>
                Количество неявок
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={noShowCount}
                onChange={(e) => setNoShowCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 border bg-transparent px-3 py-2.5 text-sm text-white outline-none transition-colors"
                style={{ borderColor: "#1e1540", borderRadius: "2px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1540")}
              />
            </div>

            {/* Ошибка */}
            {error && (
              <p className="text-sm" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}

            {/* Подтверждение для уже существующих */}
            {showConfirm && alreadyBlacklisted && (
              <div
                className="border px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  borderColor: "rgba(239,68,68,0.35)",
                  borderRadius: "2px",
                  color: "#fca5a5",
                }}
              >
                Подтвердите увеличение счётчика неявок. Нажмите кнопку ещё раз.
              </div>
            )}
          </div>

          {/* Футер */}
          <div
            className="flex items-center justify-end gap-3 border-t px-6 py-4"
            style={{ borderColor: "#1e1540" }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm transition-colors"
              style={{ color: "rgba(196,181,253,0.6)" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = "rgba(196,181,253,1)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.color = "rgba(196,181,253,0.6)")
              }
            >
              Отмена
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="relative px-5 py-2 text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(90deg, #7c3aed, #0d9488)",
                borderRadius: "2px",
                transition: "filter 0.2s, transform 0.15s",
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.filter = "brightness(1.25)";
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.background =
                    "linear-gradient(270deg, #7c3aed, #0d9488)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.filter = "";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.background =
                  "linear-gradient(90deg, #7c3aed, #0d9488)";
              }}
            >
              {isLoading
                ? "Сохранение..."
                : alreadyBlacklisted
                ? "Увеличить счётчик"
                : "Добавить в ЧС"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
