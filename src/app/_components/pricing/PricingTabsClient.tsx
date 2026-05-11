'use client';

import { useState } from "react";
import { HourlyTariffs } from "./HourlyTariffs";
import { PackagesTariffs } from "./PackagesTariffs";
import { PSTariffs } from "./PSTariffs";

export interface PricingRule {
  id: string;
  clubId: string;
  seatType: string;
  period: string;
  pricePerHour: number;
}

interface PricingTabsClientProps {
  hourlyRules: PricingRule[];
  packageRules: PricingRule[];
  psRules: PricingRule[];
  hasPS: boolean;
}

export function PricingTabsClient({ 
  hourlyRules, 
  packageRules, 
  psRules, 
  hasPS 
}: PricingTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"hourly" | "packages" | "ps">(
    "hourly"
  );

  const tabs = hasPS 
    ? [
        { id: "hourly" as const, label: "Тарифы", rules: hourlyRules },
        { id: "packages" as const, label: "Пакеты", rules: packageRules },
        { id: "ps" as const, label: "PS Area", rules: psRules },
      ]
    : [
        { id: "hourly" as const, label: "Тарифы", rules: hourlyRules },
        { id: "packages" as const, label: "Пакеты", rules: packageRules },
      ];

  const currentRules = tabs.find(tab => tab.id === activeTab)?.rules || [];

  return (
    <div className="mt-6">
      <div className="flex gap-1 border-b border-[#1e1540]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-teal-500 text-teal-500"
                : "text-violet-400/60 hover:text-violet-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "hourly" && <HourlyTariffs rules={currentRules} />}
        {activeTab === "packages" && <PackagesTariffs rules={currentRules} />}
        {activeTab === "ps" && hasPS && <PSTariffs rules={currentRules} />}
      </div>
    </div>
  );
}