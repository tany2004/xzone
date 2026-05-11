// src/app/_components/manage/pricing/ManagePricingClient.tsx
"use client";

import { useState } from "react";
import type { Club, SeatType, PricingPeriod } from "@prisma/client";
import { api } from "~/trpc/react";
import { PricingSection } from "./PricingSection";
import { AddPricingModal } from "./AddPricingModal";
import type { PricingPeriodType } from "./constants";

interface PricingRuleWithNumber {
  id: string;
  clubId: string;
  seatType: SeatType;
  period: PricingPeriod;
  pricePerHour: number;
}

interface ClubWithRules {
  club: Club;
  rules: PricingRuleWithNumber[];
}

interface Props {
  initialData: ClubWithRules[];
}

export default function ManagePricingClient({ initialData }: Props) {
  // Состояние для хранения всех данных (обновляется без перезагрузки)
  const [clubsData, setClubsData] = useState<ClubWithRules[]>(initialData);
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const { rules } of initialData) {
      for (const rule of rules) {
        map[rule.id] = String(rule.pricePerHour);
      }
    }
    return map;
  });

  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [createError, setCreateError] = useState<string | null>(null);

  const updateRule = api.admin.updatePricingRule.useMutation({
    onSuccess: (updatedRule, variables) => {
      // Обновляем данные в локальном состоянии
      setClubsData((prev) =>
        prev.map((clubData) => ({
          ...clubData,
          rules: clubData.rules.map((rule) =>
            rule.id === variables.ruleId
              ? { ...rule, pricePerHour: variables.pricePerHour }
              : rule
          ),
        }))
      );
      
      // Обновляем цену в состоянии цен
      setPrices((prev) => ({
        ...prev,
        [variables.ruleId]: String(variables.pricePerHour),
      }));
      
      // Показываем индикатор сохранения
      setSaved((prev) => ({ ...prev, [variables.ruleId]: true }));
      setTimeout(() => {
        setSaved((prev) => ({ ...prev, [variables.ruleId]: false }));
      }, 2000);
    },
  });

  const deleteRule = api.admin.deletePricingRule.useMutation({
    onSuccess: (_, variables) => {
      // Удаляем правило из локального состояния
      setClubsData((prev) =>
        prev.map((clubData) => ({
          ...clubData,
          rules: clubData.rules.filter((rule) => rule.id !== variables.ruleId),
        }))
      );
      // Удаляем из состояния цен и сохранений
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[variables.ruleId];
        return newPrices;
      });
      setSaved((prev) => {
        const newSaved = { ...prev };
        delete newSaved[variables.ruleId];
        return newSaved;
      });
    },
    onError: (error) => {
      setCreateError(error.message);
      setTimeout(() => setCreateError(null), 3000);
    },
  });

  const createRule = api.admin.createPricingRule.useMutation({
    onSuccess: (newRule) => {
      // Добавляем новое правило в локальное состояние
      setClubsData((prev) =>
        prev.map((clubData) =>
          clubData.club.id === selectedClubId
            ? {
                ...clubData,
                rules: [
                  ...clubData.rules,
                  {
                    id: newRule.id,
                    clubId: newRule.clubId,
                    seatType: newRule.seatType,
                    period: newRule.period,
                    pricePerHour: Number(newRule.pricePerHour),
                  },
                ],
              }
            : clubData
        )
      );
      
      // Добавляем цену в состояние цен
      setPrices((prev) => ({
        ...prev,
        [newRule.id]: String(Number(newRule.pricePerHour)),
      }));
      
      setShowAddModal(false);
      setCreateError(null);
    },
    onError: (error) => {
      setCreateError(error.message);
    },
  });

  function handleSave(ruleId: string) {
    const value = parseFloat(prices[ruleId] ?? "0");
    if (isNaN(value) || value <= 0) return;
    updateRule.mutate({ ruleId, pricePerHour: value });
  }

  function handleDelete(ruleId: string) {
    if (confirm("Вы уверены, что хотите удалить этот тариф?")) {
      deleteRule.mutate({ ruleId });
    }
  }

  function handleUpdatePeriod(ruleId: string, newPeriod: PricingPeriodType, currentPrice: number) {
    updateRule.mutate({ ruleId, pricePerHour: currentPrice, period: newPeriod });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Управление
      </p>
      <h1 className="mt-3 text-4xl font-bold text-white">Тарифы</h1>
      <p className="mt-2 text-sm text-violet-200/50">
        Изменения сразу отображаются на странице цен
      </p>

      <div className="mt-12 space-y-12">
        {clubsData.map(({ club, rules }) => (
          <PricingSection
            key={club.id}
            club={club}
            rules={rules}
            prices={prices}
            saved={saved}
            isUpdating={updateRule.isPending}
            onPriceChange={(ruleId, value) =>
              setPrices((prev) => ({ ...prev, [ruleId]: value }))
            }
            onSave={handleSave}
            onDelete={handleDelete}
            onUpdatePeriod={handleUpdatePeriod}
            onAddClick={(clubId) => {
              setSelectedClubId(clubId);
              setCreateError(null);
              setShowAddModal(true);
            }}
          />
        ))}
      </div>

      {showAddModal && (
        <AddPricingModal
          clubId={selectedClubId}
          onClose={() => {
            setShowAddModal(false);
            setCreateError(null);
          }}
          onCreate={(data) => createRule.mutate(data)}
          isPending={createRule.isPending}
          error={createError}
        />
      )}
    </div>
  );
}