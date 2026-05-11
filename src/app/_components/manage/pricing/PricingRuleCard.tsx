// src/app/_components/manage/pricing/PricingRuleCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Save, Check, Pencil, Trash2 } from "lucide-react";
import { seatTypeLabel, periodLabel, periodOptions, getPeriodIcon, type PricingPeriodType } from "./constants";

interface PricingRuleWithNumber {
  id: string;
  seatType: "PC" | "PS";
  period: string;
  pricePerHour: number;
}

interface PricingRuleCardProps {
  rule: PricingRuleWithNumber;
  priceValue: string;
  isSaved: boolean;
  isUpdating: boolean;
  onPriceChange: (ruleId: string, value: string) => void;
  onSave: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onUpdatePeriod: (ruleId: string, newPeriod: PricingPeriodType, currentPrice: number) => void;
}

export function PricingRuleCard({
  rule,
  priceValue,
  isSaved,
  isUpdating,
  onPriceChange,
  onSave,
  onDelete,
  onUpdatePeriod,
}: PricingRuleCardProps) {
  const [editingPeriod, setEditingPeriod] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Анимация появления
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleUpdatePeriod = (newPeriod: string) => {
    onUpdatePeriod(rule.id, newPeriod as PricingPeriodType, parseFloat(priceValue || "0"));
    setEditingPeriod(false);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-5 transition-all duration-300 hover:border-violet-500/50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
      style={{ transition: "opacity 0.3s ease, transform 0.3s ease" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 transition-all duration-300 group-hover:from-violet-600/5 group-hover:to-purple-600/5" />
      
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
            {getPeriodIcon(rule.period)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {seatTypeLabel[rule.seatType]}
            </p>
            {editingPeriod ? (
              <select
                value={rule.period}
                onChange={(e) => handleUpdatePeriod(e.target.value)}
                className="mt-1 rounded-sm border border-[#1e1540] bg-[#0e0b1a] px-2 py-1 text-xs text-white"
                autoFocus
              >
                {periodOptions[rule.seatType].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-xs text-violet-400/60">
                  {periodLabel[rule.period]}
                </p>
                <button
                  onClick={() => setEditingPeriod(true)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Pencil className="h-3 w-3 text-violet-400/60 hover:text-violet-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={priceValue}
              onChange={(e) => onPriceChange(rule.id, e.target.value)}
              className="w-28 rounded-sm border border-[#1e1540] bg-[#0e0b1a] px-3 py-2 text-right text-sm text-white transition-all focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <span className="text-sm text-violet-400/60">₽</span>
            {!["PACK_3H", "PACK_5H", "NIGHT_WEEKDAY", "NIGHT_WEEKEND"].includes(rule.period) && (
              <span className="text-xs text-violet-400/40">/час</span>
            )}
          </div>

          <button
            onClick={() => onSave(rule.id)}
            disabled={isUpdating}
            className={`flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-all ${
              isSaved
                ? "bg-teal-600/20 text-teal-400"
                : "border border-violet-600/50 bg-violet-600/10 text-violet-400 hover:bg-violet-600/20"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Сохранено</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Сохранить</span>
              </>
            )}
          </button>

          <button
            onClick={() => onDelete(rule.id)}
            className="rounded-sm p-2 text-red-400/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}