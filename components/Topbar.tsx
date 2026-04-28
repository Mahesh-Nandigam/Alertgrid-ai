"use client";

import { Bell, Search, User, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-muted-foreground hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* System Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 glow-green"></span>
          </span>
          <span className="text-xs font-medium text-green-400">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search AI Analysis..." 
            className="h-9 w-64 rounded-full bg-white/5 border border-white/10 pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 glow-red border-2 border-background"></span>
        </button>

        {/* User Profile & Sign Out Section */}
        <div className="flex items-center gap-6 pl-4 border-l border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center glow-blue overflow-hidden text-primary font-bold text-xs">
               {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-black text-white leading-none uppercase tracking-tighter italic">{profile?.name || "Operator"}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">{profile?.role || "Sector Alpha"}</p>
            </div>
          </div>

          <button 
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-xl group/btn"
            title="Terminate Session"
          >
            <LogOut className="h-3.5 w-3.5 group-hover/btn:-translate-x-1 transition-transform" /> 
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
