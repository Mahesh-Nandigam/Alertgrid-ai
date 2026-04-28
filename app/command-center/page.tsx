"use client";

import React, { useState, useEffect } from "react";
import { 
  Crosshair, 
  Shield, 
  Map as MapIcon, 
  Activity, 
  Radio, 
  Zap, 
  ShieldAlert,
  Building2,
  Navigation,
  Layers,
  Search,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const zones = [
  { id: "z1", name: "North Wing", x: "20%", y: "30%", type: "Manufacturing" },
  { id: "z2", name: "South Entry", x: "80%", y: "70%", type: "Security" },
  { id: "z3", name: "Lab Area", x: "50%", y: "40%", type: "Hazardous" },
  { id: "z4", name: "Data Center", x: "30%", y: "60%", type: "Critical" },
  { id: "z5", name: "Lobby", x: "70%", y: "30%", type: "Public" },
  { id: "z6", name: "Parking", x: "15%", y: "80%", type: "Exterior" },
];

export default function CommandCenter() {
  const { profile } = useAuth();
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const isRecent = (new Date().getTime() - data.timestamp.toDate().getTime()) < 10 * 60 * 1000;
        if (data.status === "active" && isRecent) {
          setActiveIncident(data);
          const matchedZone = zones.find(z => data.location.includes(z.name));
          if (matchedZone) setSelectedZone(matchedZone);
        } else {
          setActiveIncident(null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col gap-6 bg-[#0B0F19]">
      
      {/* MAP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111827] border border-white/5 p-8 rounded-3xl shadow-2xl">
         <div>
            <div className="flex items-center gap-4 mb-2">
               <Navigation className="h-6 w-6 text-[#3B82F6]" />
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Tactical Grid</h1>
            </div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.4em]">{profile?.organizationName} — Facility Blueprint v4.2</p>
         </div>

         <div className="flex gap-4">
            <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
               <Layers className="h-4 w-4 text-[#3B82F6]" />
               <span className="text-xs font-black text-white uppercase tracking-widest">Topo-View Active</span>
            </div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* MAP VIEWPORT */}
        <div className="lg:col-span-9 bg-[#111827] rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl group">
          {/* Tactical Grid Background */}
          <div className="absolute inset-0 opacity-10">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#3B82F6_1px,transparent_1px),linear-gradient(to_bottom,#3B82F6_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Blueprint Overlay */}
          <div className="absolute inset-20 border-2 border-white/5 rounded-[40px] pointer-events-none flex items-center justify-center">
             <div className="w-full h-full border border-white/5 rounded-[30px] flex items-center justify-center">
                <div className="w-1/2 h-1/2 border border-white/5 rounded-full" />
             </div>
          </div>

          {/* Interactive Zones */}
          {zones.map((zone) => {
            const isIncident = activeIncident && activeIncident.location.includes(zone.name);
            const isSelected = selectedZone?.id === zone.id;

            return (
              <motion.div
                key={zone.id}
                className="absolute cursor-pointer z-20"
                style={{ left: zone.x, top: zone.y }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedZone(zone)}
              >
                <div className="relative">
                  {/* Outer Pulsing Aura (Incident only) */}
                  {isIncident && (
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-10 bg-[#FF3B3B] rounded-full blur-2xl"
                    />
                  )}

                  {/* Zone Node */}
                  <div className={cn(
                    "h-8 w-8 rounded-xl flex items-center justify-center border-2 transition-all shadow-2xl",
                    isIncident ? "bg-[#FF3B3B] border-white text-white animate-bounce shadow-[0_0_30px_rgba(255,59,59,0.8)]" :
                    isSelected ? "bg-[#3B82F6] border-[#3B82F6] text-white" :
                    "bg-[#0B0F19] border-white/20 text-[#9CA3AF] hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  )}>
                    <Crosshair className="h-4 w-4" />
                  </div>

                  {/* Label */}
                  <div className={cn(
                    "absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border backdrop-blur-md transition-all",
                    isIncident ? "bg-[#FF3B3B] text-white border-white/50" : "bg-[#111827]/80 text-[#9CA3AF] border-white/5"
                  )}>
                    {profile?.organizationName} — {zone.name}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* HUD OVERLAYS */}
          <div className="absolute bottom-8 left-8 flex gap-4 pointer-events-none">
             <div className="bg-[#0B0F19]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest italic">All Nodes Synchronized</span>
             </div>
          </div>

          <div className="absolute top-8 right-8 flex gap-4">
             <button className="h-10 w-10 rounded-xl bg-[#0B0F19]/80 border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-white backdrop-blur-md transition-all">
                <Maximize2 className="h-4 w-4" />
             </button>
          </div>
        </div>

        {/* SIDE: ZONE INTEL */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-hidden">
          <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 flex flex-col gap-8 shadow-2xl flex-1 min-h-0">
             <div>
                <div className="flex items-center gap-4 mb-4">
                   <Radio className="h-5 w-5 text-[#3B82F6]" />
                   <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Zone Intelligence</h3>
                </div>
                <div className="h-px bg-white/5 w-full" />
             </div>

             <AnimatePresence mode="wait">
               {selectedZone ? (
                 <motion.div 
                   key={selectedZone.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Current Sector</label>
                       <div className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedZone.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-[#9CA3AF] uppercase mb-1">Type</div>
                          <div className="text-xs font-black text-white uppercase italic">{selectedZone.type}</div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="text-[8px] font-black text-[#9CA3AF] uppercase mb-1">Status</div>
                          <div className="text-xs font-black text-green-500 uppercase italic">SECURE</div>
                       </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                       <h4 className="text-[9px] font-black text-[#3B82F6] uppercase tracking-[0.3em]">Sector Telemetry</h4>
                       <div className="space-y-3">
                          {[
                            { label: "Thermal Load", val: "24°C" },
                            { label: "Oxygen Levels", val: "21.2%" },
                            { label: "Motion Status", val: "IDLE" },
                            { label: "Keycard Auth", val: "v2.0" },
                          ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/5">
                               <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">{stat.label}</span>
                               <span className="text-[10px] font-black text-white">{stat.val}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    {activeIncident && activeIncident.location.includes(selectedZone.name) && (
                      <div className="p-6 rounded-2xl bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 shadow-[0_0_20px_rgba(255,59,59,0.1)]">
                         <div className="flex items-center gap-3 text-[#FF3B3B] mb-4">
                            <ShieldAlert className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Containment</span>
                         </div>
                         <p className="text-xs text-white/90 font-bold leading-relaxed italic">
                           Sector integrity compromised. Initializing remote suppression protocols.
                         </p>
                      </div>
                    )}
                 </motion.div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                    <MapIcon className="h-16 w-16 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select a tactical sector for detailed telemetry</p>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
