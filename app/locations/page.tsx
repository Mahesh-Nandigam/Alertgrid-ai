"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Globe, 
  Plus, 
  Search, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Building2, 
  ShieldCheck,
  ChevronRight,
  Activity,
  Droplets,
  Zap,
  Lock,
  Wind
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface Location {
  id: string;
  name: string;
  type: string;
  status: "Secure" | "Warning" | "Critical";
  riskScore: number;
  occupancy: number;
  lastIncident: string;
  image: string;
  subTitle: string;
}

export default function LocationsPage() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const locations: Location[] = [
    { 
      id: "l1", 
      name: "North Wing", 
      subTitle: `${profile?.organizationName} — Phase 1`,
      type: "Manufacturing Hub", 
      status: "Secure", 
      riskScore: 12, 
      occupancy: 450,
      lastIncident: "Standard Audit (2d ago)",
      image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l2", 
      name: "Hazmat Lab Delta", 
      subTitle: `${profile?.organizationName} — Research`,
      type: "Hazardous Zone", 
      status: "Warning", 
      riskScore: 54, 
      occupancy: 12,
      lastIncident: "Gas Leak Sensor (4h ago)",
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l3", 
      name: "Data Vault 9", 
      subTitle: `${profile?.organizationName} — Infrastructure`,
      type: "Critical Storage", 
      status: "Secure", 
      riskScore: 8, 
      occupancy: 4,
      lastIncident: "None",
      image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l4", 
      name: "Corporate HQ", 
      subTitle: `${profile?.organizationName} — Command`,
      type: "Administrative Hub", 
      status: "Secure", 
      riskScore: 15, 
      occupancy: 1200,
      lastIncident: "System Drill (1w ago)",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2072&auto=format&fit=crop" 
    },
    { 
      id: "l5", 
      name: "Substation 4", 
      subTitle: `${profile?.organizationName} — Energy`,
      type: "Power Utility", 
      status: "Warning", 
      riskScore: 42, 
      occupancy: 8,
      lastIncident: "Load Surge (12h ago)",
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l6", 
      name: "Logistics Hub", 
      subTitle: `${profile?.organizationName} — Supply`,
      type: "Transport Node", 
      status: "Secure", 
      riskScore: 18, 
      occupancy: 250,
      lastIncident: "None",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l7", 
      name: "Testing Range", 
      subTitle: `${profile?.organizationName} — Field Ops`,
      type: "Experimental", 
      status: "Critical", 
      riskScore: 88, 
      occupancy: 24,
      lastIncident: "Pressure Test Failure (1h ago)",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" 
    },
    { 
      id: "l8", 
      name: "Server Farm B", 
      subTitle: `${profile?.organizationName} — Cloud`,
      type: "Data Center", 
      status: "Secure", 
      riskScore: 5, 
      occupancy: 2,
      lastIncident: "Maintenance (3d ago)",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2074&auto=format&fit=crop" 
    },
  ];

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-10 max-w-[1600px] mx-auto bg-[#0B0F19] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Institutional Assets</h1>
          <p className="text-[#9CA3AF] mt-4 font-bold tracking-[0.4em] text-[10px] uppercase">Operational Inventory for {profile?.organizationName}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6]" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111827] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] w-80 transition-all shadow-xl"
            />
          </div>
          <button className="px-8 py-4 rounded-2xl bg-[#3B82F6] text-white font-black text-xs flex items-center gap-3 hover:brightness-110 uppercase tracking-widest shadow-xl transition-all">
            <Plus className="h-4 w-4" /> Register Asset
          </button>
        </div>
      </div>

      {/* ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {filteredLocations.map((loc, i) => (
          <motion.div 
            key={loc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111827] border border-white/10 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#3B82F6]/50 transition-all flex flex-col shadow-2xl h-full"
          >
            <div className="h-64 relative overflow-hidden shrink-0 bg-white/5">
              <img 
                src={loc.image} 
                alt={loc.name} 
                className="w-full h-full object-cover block group-hover:scale-110 transition-transform duration-1000" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />
              
              <div className="absolute top-6 right-6">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md",
                  loc.status === "Secure" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                  loc.status === "Warning" ? "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.3)]" :
                  "bg-[#FF3B3B]/20 text-[#FF3B3B] border-[#FF3B3B]/30 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                )}>
                  {loc.status}
                </span>
              </div>

              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-2 text-white/60 mb-2">
                   <Building2 className="h-3.5 w-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{loc.type}</span>
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-[#3B82F6] transition-colors tracking-tighter uppercase italic leading-none">{loc.name}</h3>
                <p className="text-[10px] font-black text-[#9CA3AF] mt-2 uppercase tracking-[0.2em]">{loc.subTitle}</p>
              </div>
            </div>

            <div className="p-8 space-y-8 flex-1">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" /> Risk Score
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white italic">{loc.riskScore}</span>
                    <TrendingUp className={cn("h-4 w-4 mb-2", loc.riskScore > 50 ? "text-[#FF3B3B]" : "text-green-500")} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> Occupancy
                  </div>
                  <div className="text-3xl font-black text-white italic">{loc.occupancy}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.3em]">Operational Status</div>
                <div className="flex items-center justify-between">
                   <div className="flex gap-2">
                      <Zap className="h-3.5 w-3.5 text-yellow-500" />
                      <Droplets className="h-3.5 w-3.5 text-[#3B82F6]" />
                      <Lock className="h-3.5 w-3.5 text-green-500" />
                   </div>
                   <span className="text-[10px] font-black text-white uppercase italic">Optimal</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Active Monitoring</span>
                </div>
                <button className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[#3B82F6] transition-all flex items-center gap-2 italic">
                  Manage Asset <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FOOTER METRICS */}
      <div className="bg-[#111827] p-10 border border-white/10 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <ShieldCheck className="h-64 w-64 text-white" />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1 space-y-4">
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Security Grid</h3>
               <div className="flex items-center gap-6">
                  <div className="text-5xl font-black text-[#3B82F6] italic tracking-tighter leading-none">94.2%</div>
                  <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">↑ Stabilized</div>
               </div>
            </div>
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: "Asset Value", val: "$1.2B", sub: "INSTITUTIONAL" },
                 { label: "Safety Sync", val: "REAL-TIME", sub: "ACTIVE" },
                 { label: "Population", val: "1.8K", sub: "REGISTERED" },
                 { label: "Grid Status", val: "ELITE", sub: "LEVEL 4" },
               ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                    <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{stat.label}</div>
                    <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{stat.val}</div>
                    <div className="text-[9px] font-black text-[#3B82F6] uppercase tracking-widest">{stat.sub}</div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
