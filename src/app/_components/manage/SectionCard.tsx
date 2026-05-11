import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionCardProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export function SectionCard({ href, label, description, icon: Icon, color, iconColor }: SectionCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/50"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      
      <div className="relative">
        <div className={`flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br ${color} ${iconColor}`}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <h2 className="mt-4 text-base font-semibold text-white">{label}</h2>
        <p className="mt-1 text-sm text-violet-200/50">{description}</p>
        <div className="mt-4 flex items-center gap-1 text-xs text-violet-400/60 group-hover:text-teal-400">
          <span>Перейти</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}