"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Zap, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck,
  Terminal,
  Flame,
  Wind,
  UserX,
  DoorOpen,
  Radio,
  Cpu,
  PhoneCall,
  Skull,
  Building2,
  CheckCircle2,
  Info,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, query, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { profile } = useAuth();
  const router = useRouter();
  const [activeIncident, setActiveIncident] = useState<any>(null);
  const [logs, setLogs] = useState<{ time: string, msg: string, type: string }[]>([]);
  const [callProgress, setCallProgress] = useState({ initiated: 0, connected: 0, pending: 0 });

  useEffect(() => {
    // Listen for the absolute latest incident
    const q = query(collection(db, "incidents"), orderBy("timestamp", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        // Only show if it's "Active" and relatively recent (within last 10 mins for realism)
        const isRecent = (new Date().getTime() - data.timestamp.toDate().getTime()) < 10 * 60 * 1000;
        
        if (data.status === "active" && isRecent) {
          setActiveIncident({ id: snapshot.docs[0].id, ...data });
          updateLogs(data);
          simulateCalls();
        } else {
          setActiveIncident(null);
        }
      } else {
        setActiveIncident(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateLogs = (incident: any) => {
    const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLogs = [
      { time: time(), msg: `🚨 [${profile?.organizationName}] ${incident.type} detected`, type: "alert" },
      { time: time(), msg: `📞 Protocol initiated: Calling institution responders...`, type: "info" },
      { time: time(), msg: `🧠 Gemini AI generating specific tactical route...`, type: "info" },
      { time: time(), msg: `✅ External emergency services notified via API.`, type: "success" },
    ];
    setLogs(newLogs);
  };

  const simulateCalls = () => {
    setCallProgress({ initiated: 3, connected: 1, pending: 2 });
    setTimeout(() => setCallProgress({ initiated: 3, connected: 3, pending: 0 }), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[#0B0F19] min-h-screen">
      
      {/* PERSONALIZED ENTERPRISE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111827] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 className="h-32 w-32" />
         </div>
         <div className="relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
               Welcome back, {profile?.name || "Commander"}
            </h1>
            <div className="flex items-center gap-3 mt-2">
               <div className="h-6 w-6 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-[#3B82F6]" />
               </div>
               <span className="text-sm font-black text-[#3B82F6] uppercase tracking-[0.3em]">{profile?.organizationName || "GLOBAL"} COMMAND CENTER</span>
            </div>
         </div>
         <div className="relative z-10 flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Nodes Operational</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN AREA */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {activeIncident ? (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel border-[#FF3B3B]/40 bg-[#FF3B3B]/5 p-8 relative overflow-hidden ring-4 ring-[#FF3B3B]/10"
              >
                <div className="absolute inset-0 border-2 border-[#FF3B3B]/30 animate-pulse pointer-events-none" />
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 rounded-3xl bg-[#FF3B3B]/20 border border-[#FF3B3B]/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,59,59,0.2)]">
                          <Flame className="h-12 w-12 text-[#FF3B3B] animate-bounce" />
                       </div>
                       <div>
                          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {activeIncident.type}
                          </h2>
                          <p className="text-[#FF3B3B] font-black tracking-[0.4em] uppercase text-sm mt-2">{profile?.organizationName} — {activeIncident.location}</p>
                       </div>
                    </div>
                    <div className="bg-[#FF3B3B] text-white px-8 py-3 rounded-xl font-black tracking-widest text-xl shadow-[0_0_40px_rgba(255,59,59,0.5)] italic">
                      CRITICAL
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-inner">
                       <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" /> Personnel At Risk
                       </div>
                       <div className="text-5xl font-black text-white italic tracking-tighter">42</div>
                       <div className="text-[10px] font-bold text-[#FF3B3B] mt-2 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="h-3 w-3" /> Area Compromised
                       </div>
                    </div>
                    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-inner">
                       <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <DoorOpen className="h-4 w-4" /> Secure Exits
                       </div>
                       <div className="text-5xl font-black text-green-500 italic tracking-tighter">03/05</div>
                       <div className="flex gap-1.5 mt-3">
                          {[1,2,3].map(i => <div key={i} className="h-1.5 flex-1 bg-green-500 rounded-full" />)}
                          {[1,2].map(i => <div key={i} className="h-1.5 flex-1 bg-red-500/20 rounded-full" />)}
                       </div>
                    </div>
                    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-inner">
                       <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4" /> AI Risk Index
                       </div>
                       <div className="text-5xl font-black text-[#3B82F6] italic tracking-tighter">92.4%</div>
                       <div className="text-[10px] font-bold text-[#3B82F6]/60 mt-2 uppercase tracking-widest italic font-black">Escalation Probability</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button 
                      onClick={() => alert("🚨 Tactical Units Dispatched. GPS Sync Active.")}
                      className="py-5 rounded-2xl bg-[#FF3B3B] text-white font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_30px_rgba(255,59,59,0.3)] transition-all"
                    >
                      Dispatch
                    </button>
                    <button 
                      onClick={() => alert("🔒 Perimeter Lockdown Initiated. All magnetic seals engaged.")}
                      className="py-5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-500 font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
                    >
                      Lockdown
                    </button>
                    <button 
                      onClick={() => alert("🔊 Audio/Visual Alarms Triggered in compromise zone.")}
                      className="py-5 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 font-black text-xs uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all"
                    >
                      Alarm
                    </button>
                    <button 
                      onClick={() => alert("📱 Emergency Notification broadcast to all personnel via SMS/App.")}
                      className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Notify
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* IDLE STATE: SYSTEM STATUS PANEL */}
                <div className="bg-[#111827] border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
                   <div className="h-28 w-28 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 relative">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                      <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                   </div>
                   <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">All Systems Clear</h2>
                   <p className="text-[#9CA3AF] max-w-lg mx-auto font-bold tracking-widest text-xs uppercase mt-4">
                      {profile?.organizationName} Security Grid is currently operating within normal parameters.
                   </p>
                   
                   <div className="mt-12 flex flex-wrap justify-center gap-4 relative z-10">
                      <button 
                         onClick={() => router.push("/simulation")} 
                         className="px-8 py-4 rounded-2xl bg-[#3B82F6] text-white font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all flex items-center gap-3 cursor-pointer"
                      >
                         <Play className="h-4 w-4" /> Trigger Readiness Test
                      </button>
                      <button 
                         onClick={() => router.push("/compliance")} 
                         className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer"
                      >
                         <ShieldCheck className="h-4 w-4" /> Review Audit Logs
                      </button>
                   </div>
                </div>

                {/* ORGANIZATION INSIGHTS PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   {[
                     { label: "Zones Monitored", value: "8", icon: Building2 },
                     { label: "Active Incidents", value: "0", icon: AlertTriangle },
                     { label: "Total Simulations", value: "12", icon: Zap },
                     { label: "Response SLA", value: "94%", icon: Activity },
                   ].map((stat, i) => (
                     <div key={i} className="bg-[#111827] p-6 rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                           <stat.icon className="h-5 w-5 text-[#3B82F6]" />
                        </div>
                        <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none">{stat.label}</h3>
                        <div className="text-3xl font-black text-white italic tracking-tighter mt-2 leading-none">{stat.value}</div>
                     </div>
                   ))}
                </div>

                <div className="bg-[#111827] border border-[#3B82F6]/30 bg-gradient-to-r from-[#3B82F6]/5 to-transparent rounded-2xl p-6 flex items-center gap-6">
                   <div className="h-12 w-12 rounded-xl bg-[#3B82F6]/20 flex items-center justify-center">
                      <Info className="h-6 w-6 text-[#3B82F6]" />
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">AI Command Insight</h4>
                      <p className="text-[11px] text-[#9CA3AF] font-bold mt-1 italic uppercase tracking-wider">
                         "All monitored zones in {profile?.organizationName} are stable. No thermal or structural anomalies detected in the last 24 hours."
                      </p>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDE COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* LOGS PANEL */}
           <div className="bg-[#111827] border border-white/10 rounded-3xl flex flex-col h-[450px] shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                 <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-[#3B82F6]" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Facility Stream</h3>
                 </div>
                 <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                 {logs.length > 0 ? logs.map((log, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={cn(
                       "p-4 rounded-xl border flex gap-4 items-start",
                       log.type === "alert" ? "bg-[#FF3B3B]/10 border-[#FF3B3B]/20" : "bg-white/5 border-white/5"
                     )}
                   >
                      <span className="text-[9px] font-mono text-[#9CA3AF] mt-0.5">{log.time}</span>
                      <p className={cn("text-xs font-bold leading-relaxed", log.type === "alert" ? "text-[#FF3B3B]" : "text-white/80")}>
                         {log.msg}
                      </p>
                   </motion.div>
                 )) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20 px-8">
                      <Activity className="h-12 w-12 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Monitoring Network Traffic at {profile?.organizationName}</p>
                   </div>
                 )}
              </div>
           </div>

           {/* CALL TELEMETRY */}
           <div className="bg-[#111827] p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">Response Dispatch</h3>
                 <PhoneCall className={cn("h-4 w-4 text-[#3B82F6]", activeIncident && "animate-bounce")} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <div className="text-center">
                    <div className="text-2xl font-black text-white italic leading-none">{callProgress.initiated}</div>
                    <div className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest mt-2">Calls</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-black text-green-500 italic leading-none">{callProgress.connected}</div>
                    <div className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest mt-2">Reach</div>
                 </div>
                 <div className="text-center">
                    <div className="text-2xl font-black text-[#F59E0B] italic leading-none">{callProgress.pending}</div>
                    <div className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest mt-2">Queue</div>
                 </div>
              </div>
              {activeIncident && (
                <div className="mt-8 h-2 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(callProgress.connected / callProgress.initiated) * 100}%` }}
                     className="h-full bg-green-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                   />
                </div>
              )}
           </div>

           {/* TACTICAL INTEL WIDGET */}
           <div className={cn(
             "p-8 rounded-3xl border transition-all duration-700 shadow-2xl",
             activeIncident ? "bg-[#6366F1]/10 border-[#6366F1]/30" : "bg-[#111827] border-white/10 opacity-30"
           )}>
              <div className="flex items-center gap-4 mb-6">
                 <Radio className="h-5 w-5 text-[#6366F1]" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic">AI Command Subroutine</h3>
              </div>
              <div className="space-y-4">
                 {activeIncident ? (
                   <>
                     <p className="text-sm text-white/90 font-black italic leading-relaxed">
                       "Evacuate {profile?.organizationName} {activeIncident.location} via east corridor only. Block access to stairwell B."
                     </p>
                     <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-[#6366F1]">Sync Confidence: 98%</span>
                     </div>
                   </>
                 ) : (
                   <p className="text-[10px] text-[#9CA3AF] italic uppercase tracking-widest">Waiting for incident telemetry...</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
