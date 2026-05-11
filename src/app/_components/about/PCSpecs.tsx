'use client';

import { 
  Cpu, 
  Gamepad2, 
  HardDrive, 
  MemoryStick, 
  Monitor, 
  Keyboard, 
  Mouse, 
  Headphones 
} from "lucide-react";
import { pcSpecs } from "./constants";

const iconMap: Record<string, any> = {
  Cpu: Cpu,
  Gamepad2: Gamepad2,
  HardDrive: HardDrive,
  MemoryStick: MemoryStick,
  Monitor: Monitor,
  Keyboard: Keyboard,
  Mouse: Mouse,
  Headphones: Headphones,
};

export function PCSpecs() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {pcSpecs.map((spec, index) => {
        const IconComponent = iconMap[spec.iconName];
        return (
          <div
            key={spec.component}
            className="group relative overflow-hidden rounded-sm border border-[#1e1540] bg-gradient-to-br from-[#120e24] to-[#0e0b1a] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-purple-600/0 transition-all duration-300 group-hover:from-violet-600/10 group-hover:to-purple-600/10" />
            
            <div className="relative flex flex-col items-center text-center">
              <IconComponent className="mb-4 h-12 w-12 text-white" strokeWidth={1.5} />
              <p className="text-xs font-medium uppercase tracking-wider text-violet-400/70">
                {spec.component}
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {spec.model}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}