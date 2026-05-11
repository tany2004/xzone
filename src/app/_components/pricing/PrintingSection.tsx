'use client';

import { Printer, Scan, Copy, Layers } from "lucide-react";

const printing = [
  { name: "Печать ч/б", price: "8/10 ₽", description: "А4 / А3", icon: Printer },
  { name: "Печать цветная", price: "40/70 ₽", description: "А4 / А3", icon: Printer },
  { name: "Сканирование", price: "15/25 ₽", description: "А4 / А3", icon: Scan },
  { name: "Копирование", price: "5 ₽", description: "А4", icon: Copy },
  { name: "Ламинирование", price: "50/70 ₽", description: "А4 / А3", icon: Layers },
];

export function PrintingSection() {
  return (
    <section className="mt-20">
      <p className="text-xs font-semibold uppercase tracking-[2px] text-teal-500">
        Услуги
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">Полиграфия</h2>
      <p className="mt-1 text-sm text-violet-200/50">Печать и копирование документов</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {printing.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="group relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-5 text-center transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 transition-all duration-300 group-hover:from-violet-600/10 group-hover:to-purple-600/10" />
              
              <div className="relative">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-xs text-violet-400/60">{item.description}</p>
                <p className="mt-3 text-xl font-bold text-teal-400">{item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}