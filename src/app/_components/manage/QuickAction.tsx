import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickActionProps {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export function QuickAction({ href, label, icon: Icon, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-4 transition-all duration-300 hover:border-violet-500/50"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-br ${color}`}>
          <Icon size={16} strokeWidth={1.5} className="text-white" />
        </div>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <ArrowRight size={14} className="text-violet-400/60 transition-transform group-hover:translate-x-1 group-hover:text-teal-400" />
    </Link>
  );
}