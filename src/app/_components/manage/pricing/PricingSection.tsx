// src/app/_components/manage/pricing/PricingSection.tsx
"use client";

import { Plus } from "lucide-react";
import type { Club } from "@prisma/client";
import { PricingRuleCard } from "./PricingRuleCard";
import type { PricingPeriodType } from "./constants";

interface PricingRuleWithNumber {
  id: string;
  clubId: string;
  seatType: "PC" | "PS";
  period: string;
  pricePerHour: number;
}

interface PricingSectionProps {
  club: Club;
  rules: PricingRuleWithNumber[];
  prices: Record<string, string>;
  saved: Record<string, boolean>;
  isUpdating: boolean;
  onPriceChange: (ruleId: string, value: string) => void;
  onSave: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onUpdatePeriod: (ruleId: string, newPeriod: PricingPeriodType, currentPrice: number) => void;
  onAddClick: (clubId: string) => void;
}

export function PricingSection({
  club,
  rules,
  prices,
  saved,
  isUpdating,
  onPriceChange,
  onSave,
  onDelete,
  onUpdatePeriod,
  onAddClick,
}: PricingSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{club.name}</h2>
          <div className="mt-1 h-px w-20 bg-gradient-to-r from-teal-500 to-transparent" />
        </div>
        <button
          onClick={() => onAddClick(club.id)}
          className="flex items-center gap-2 rounded-sm border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-sm text-teal-400 transition-colors hover:bg-teal-500/20"
        >
          <Plus className="h-4 w-4" />
          Добавить тариф
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        {rules.map((rule) => (
          <PricingRuleCard
            key={rule.id}
            rule={rule}
            priceValue={prices[rule.id] ?? ""}
            isSaved={!!saved[rule.id]}
            isUpdating={isUpdating}
            onPriceChange={onPriceChange}
            onSave={onSave}
            onDelete={onDelete}
            onUpdatePeriod={onUpdatePeriod}
          />
        ))}
      </div>
    </section>
  );
}