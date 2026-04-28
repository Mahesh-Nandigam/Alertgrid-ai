"use client";

import React, { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertCircle, BarChart3, Lightbulb, Zap, ArrowDown, Map as MapIcon, ShieldAlert, Radio, Activity, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface Pattern {
  title: string;
  count: number;
  trend: "up" | "down" | "stable";
  riskLevel: "Low" | "Medium" | "High";
  description: string;
}

export default function IntelligencePage() {
  const { profile } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [zoneRisks, setZoneRisks] = useState<Record<string, number>>({});

  useEffect(() => {
    // Real-time density-based risk calculation
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      const activePatterns: Pattern[] = [];
      
      const now = new Date().getTime();
      const tenMinutesAgo = now - 10 * 60 * 1000;

      const activeIncidents = snapshot.docs.filter(doc => {
        const data = doc.data();
        const isRecent = data.timestamp.toDate().getTime() > tenMinutesAgo;
        return data.status === "active" && isRecent;
      });

      activeIncidents.forEach(doc => {
        const data = doc.data();
        const loc = data.location || "Unknown";
        counts[loc] = (counts[loc] || 0) + 1;
        
        // Add dynamic AI insights based on current threats
        if (activePatterns.length < 3) {
          activePatterns.push({
            title: `${data.type} detected`,
            count: 1,
            trend: "up",
            riskLevel: "High",
            description: `Real-time anomaly detected at ${loc}. Gemini AI recommends immediate perimeter lockdown and evacuation of adjacent sectors.`
          });
        }
      });

      setZoneRisks(counts);
      
      if (activeIncidents.length === 0) {
        setPatterns([
          { title: "Grid Fault Patterns", count: 0, trend: "stable", riskLevel: "Low", description: "All power systems are functioning within normal operational parameters. No faults detected." },
          { title: "Physical Breaches", count: 0, trend: "stable", riskLevel: "Low", description: "Internal and external sensor arrays report zero unauthorized access attempts in the last surveillance cycle." },
          { title: "Thermal Anomalies", count: 0, trend: "stable", riskLevel: "Low", description: "Climate control systems are maintaining optimal temperatures across all server and hardware nodes." },
        ]);
      } else {
        setPatterns(activePatterns);
      }
    });

    return () => unsubscribe();
  }, []);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto bg-[#0B0F19] min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
            <Brain className="h-14 w-14 text-[#3B82F6]" />
            Cognitive Intel
          </h1>
          <p className="text-[#9CA3AF] mt-4 font-bold tracking-[0.4em] text-[10px] uppercase italic">
            Predictive AI Analysis for {profile?.organizationName}
          </p>
        </div>
        
        <button 
          onClick={runAnalysis}
          disabled={analyzing}
          className={cn(
            "relative px-10 py-4 rounded-2xl bg-[#3B82F6] text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]",
            analyzing && "cursor-not-allowed opacity-80"
          )}
        >
          {analyzing ? <Loader2 className="h-4 w-4 animate-spin inline mr-3" /> : <Zap className="h-4 w-4 inline mr-3" />}
          {analyzing ? "Synthesizing..." : "Recalculate Grid"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TACTICAL HEATMAP */}
        <div className="lg:col-span-8 bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] flex items-center gap-3">
              <MapIcon className="h-4 w-4 text-[#3B82F6]" />
              Institutional Risk Distribution
            </h2>
            <div className="flex items-center gap-2 text-[9px] font-black text-[#3B82F6] uppercase tracking-widest animate-pulse">
               <Radio className="h-3 w-3" /> Real-time Nodes Active
            </div>
          </div>
          <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-4 h-[450px]">
            {["North Wing", "South Entry", "Hazmat Lab", "Data Vault", "Lobby", "Parking", "Substation 4", "Server Room"].map((zone, i) => {
              const risk = zoneRisks[zone] || 0;
              const intensity = Math.min(risk * 15, 100);
              return (
                <motion.div 
                  key={zone}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-2xl border border-white/5 flex items-center justify-center group overflow-hidden bg-[#0B0F19]"
                >
                  <div 
                    className="absolute inset-0 transition-all duration-1000"
                    style={{ backgroundColor: risk > 0 ? `rgba(239, 68, 68, ${intensity / 100 * 0.4})` : 'transparent' }}
                  />
                  {risk > 0 && (
                    <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-[#FF3B3B]/10 blur-xl"
                    />
                  )}
                  <div className="text-center z-10 p-4">
                    <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest group-hover:text-white transition-all">{zone}</div>
                    {risk > 0 ? (
                      <div className="text-lg font-black text-[#FF3B3B] mt-2 italic">{risk} THREATS</div>
                    ) : (
                      <div className="text-[8px] font-bold text-green-500/40 mt-2 uppercase">NOMINAL</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RISK PROFILE */}
        <div className="lg:col-span-4 bg-[#111827] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl flex flex-col">
          <div className="flex items-center gap-4 mb-8">
             <BarChart3 className="h-6 w-6 text-[#3B82F6]" />
             <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Asset Vulnerability</h3>
          </div>
          
          <div className="space-y-10 flex-1">
            {Object.entries(zoneRisks)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([zone, risk], i) => (
                <div key={zone} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{zone}</span>
                    <span className="text-xs font-black text-[#FF3B3B] italic">{risk} ALERTS</span>
                  </div>
                  <div className="h-2 w-full bg-[#0B0F19] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(risk * 10, 100)}%` }}
                      className={cn("h-full rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]", risk > 5 ? "bg-[#FF3B3B]" : "bg-orange-500")}
                    />
                  </div>
                </div>
              ))}
            {Object.keys(zoneRisks).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                 <ShieldAlert className="h-16 w-16 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-center">No structural hotspots detected in institutional grid</p>
              </div>
            )}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-[#3B82F6]/5 border border-[#3B82F6]/20">
             <div className="flex items-center gap-3 text-[#3B82F6] mb-3">
                <Activity className="h-4 w-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Network Stability</h4>
             </div>
             <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">99.8% System Uptime Across All Managed Nodes</p>
          </div>
        </div>
      </div>

      {/* AI INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {patterns.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 hover:border-[#3B82F6]/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Cpu className="h-24 w-24 text-white" />
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <h3 className="text-2xl font-black text-white group-hover:text-[#3B82F6] transition-colors uppercase italic tracking-tighter">{p.title}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                p.riskLevel === "High" ? "bg-[#FF3B3B]/10 text-[#FF3B3B] border-[#FF3B3B]/20" :
                p.riskLevel === "Medium" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
              )}>
                {p.riskLevel} Risk
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] font-bold leading-relaxed mb-8 relative z-10 uppercase tracking-wide italic">"{p.description}"</p>
            <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white italic">{p.count}</span>
                <span className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none">Detected<br/>Patterns</span>
              </div>
              <div className="flex items-center text-[#FF3B3B] text-[10px] font-black uppercase tracking-widest italic">
                <TrendingUp className="h-4 w-4 mr-2" /> Escalating
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
