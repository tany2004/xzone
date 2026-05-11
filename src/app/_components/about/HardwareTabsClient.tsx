'use client';

import { useState } from "react";
import { Monitor, Gamepad } from "lucide-react";
import { PCSpecs } from "./PCSpecs";
import { PSSpecs } from "./PSSpecs";

export function HardwareTabsClient() {
  const [activeTab, setActiveTab] = useState<"pc" | "ps">("pc");

  return (
    <div className="mt-8">
      <div className="flex gap-1 border-b border-[#1e1540]">
        <button
          onClick={() => setActiveTab("pc")}
          className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "pc"
              ? "border-b-2 border-teal-500 text-teal-500"
              : "text-violet-400/60 hover:text-violet-400"
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>ПК</span>
        </button>
        <button
          onClick={() => setActiveTab("ps")}
          className={`px-6 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "ps"
              ? "border-b-2 border-teal-500 text-teal-500"
              : "text-violet-400/60 hover:text-violet-400"
          }`}
        >
          <Gamepad className="h-4 w-4" />
          <span>PS / Xbox</span>
        </button>
      </div>

      <div className="mt-8">
        {activeTab === "pc" && <PCSpecs />}
        {activeTab === "ps" && <PSSpecs />}
      </div>
    </div>
  );
}