"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Zap, 
  Globe, 
  ShieldCheck,
  Play,
  Terminal,
  Crosshair,
  Radio,
  Settings,
  HelpCircle,
  Activity,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, tooltip: "Main Command Panel" },
  { name: "Tactical Map", href: "/command-center", icon: Crosshair, tooltip: "Area Operations" },
  { name: "Intelligence", href: "/intelligence", icon: Brain, tooltip: "AI Risk Analysis" },
  { name: "Simulation", href: "/simulation", icon: Play, tooltip: "Trigger Crisis" },
  { name: "Asset Manager", href: "/locations", icon: Globe, tooltip: "Site Status" },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck, tooltip: "Audit Logs" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col bg-[#0B0F19] h-screen border-r border-white/10">
      {/* BRANDING */}
      <div className="h-20 flex items-center px-8 border-b border-white/5 relative">
        <Link href="/" className="flex items-center gap-3">
          <Radio className="h-6 w-6 text-[#3B82F6]" />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-white uppercase italic">
              ALERTGRID
            </span>
            <span className="text-[8px] font-black text-[#3B82F6] tracking-[0.3em]">
              COMMAND AI v4
            </span>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.tooltip}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-xs transition-all duration-300 group relative",
                isActive 
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white font-black" 
                  : "text-[#E5E7EB] hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-[#9CA3AF] group-hover:text-white"
              )} />
              <span className="uppercase tracking-widest font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-white/5 space-y-2 bg-[#111827]/50">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all uppercase tracking-widest">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link href="/help" className="flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-bold text-[#9CA3AF] hover:text-white transition-all uppercase tracking-widest">
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Link>
      </div>
    </aside>
  );
}
