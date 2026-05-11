"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { periodOptions, type PricingPeriodType } from "./constants";

interface AddPricingModalProps {
  clubId: string;
  onClose: () => void;
  onCreate: (data: {
    clubId: string;
    seatType: "PC" | "PS";
    period: PricingPeriodType;
    pricePerHour: number;
  }) => void;
  isPending: boolean;
  error?: string | null;
}

export function AddPricingModal({
  clubId,
  onClose,
  onCreate,
  isPending,
  error,
}: AddPricingModalProps) {
  const [seatType, setSeatType] = useState<"PC" | "PS">("PC");
  const [period, setPeriod] = useState<PricingPeriodType | "">("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!period || !price) return;
    onCreate({
      clubId,
      seatType,
      period: period as PricingPeriodType,
      pricePerHour: parseFloat(price),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-sm border border-[#1e1540] bg-[#0a0814] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Добавить тариф</h3>
          <button onClick={onClose} className="text-violet-400/60 hover:text-violet-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-violet-400 mb-1">
              Тип места
            </label>
            <select
              value={seatType}
              onChange={(e) => {
                setSeatType(e.target.value as "PC" | "PS");
                setPeriod("");
              }}
              className="w-full rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="PC">ПК</option>
              <option value="PS">PS / Xbox</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-400 mb-1">
              Период
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PricingPeriodType)}
              className="w-full rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
              required
            >
              <option value="">Выберите период</option>
              {periodOptions[seatType].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-400 mb-1">
              Цена (₽)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-sm border border-[#1e1540] bg-[#120e24] px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
              placeholder="Введите цену"
              required
            />
          </div>

          {error && (
            <div className="rounded-sm border border-red-700/50 bg-red-950/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-sm border border-[#1e1540] bg-[#120e24] px-4 py-2 text-sm text-violet-400 transition-colors hover:bg-violet-500/10"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-sm bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isPending ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}