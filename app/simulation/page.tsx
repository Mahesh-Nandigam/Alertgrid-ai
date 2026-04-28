"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  ShieldAlert, 
  Flame, 
  UserX, 
  Cpu, 
  RefreshCcw, 
  PhoneCall, 
  Loader2, 
  ArrowRight,
  Users,
  Wind,
  Zap,
  MoveHorizontal,
  Terminal,
  Activity,
  Radio,
  Lock,
  ChevronRight,
  Skull,
  Plus,
  Trash2,
  X,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, addDoc, Timestamp, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateTacticalPlan } from "@/lib/gemini";
import { useAuth } from "@/context/AuthContext";

const scenarios = [
  { id: "fire", name: "Structural Fire", icon: Flame, color: "text-[#FF3B3B]", priority: "Critical", location: "North Wing", desc: "Thermal runaway in main transformer.", voiceMsg: "Priority Alpha. Structural fire detected in North Wing. Evacuate immediately." },
  { id: "chemical", name: "Chemical Leak", icon: Wind, color: "text-[#F59E0B]", priority: "Critical", location: "Hazmat Lab", desc: "Pressurized gas release in research floor.", voiceMsg: "Hazmat Alert. Chemical leak in Lab Delta. Seal all atmospheric vents." },
  { id: "intrusion", name: "Security Breach", icon: UserX, color: "text-orange-500", priority: "High", location: "Data Vault", desc: "Unauthorized physical access to servers.", voiceMsg: "Security Breach. Unauthorized entry in Vault 9. Initiate lockdown." },
  { id: "shooter", name: "Active Threat", icon: Skull, color: "text-[#FF3B3B]", priority: "Critical", location: "Main Lobby", desc: "Armed intrusion at checkpoints.", voiceMsg: "Code Red. Active threat at Lobby Entrance. Run, Hide, Fight active." },
  { id: "grid", name: "Power Failure", icon: Zap, color: "text-[#3B82F6]", priority: "High", location: "Substation 4", desc: "Total blackout and sync failure.", voiceMsg: "Grid Alert. Power failure at Substation 4. Switch to manual patrol." },
  { id: "medical", name: "Mass Casualty", icon: ShieldAlert, color: "text-pink-500", priority: "High", location: "Atrium Level 2", desc: "Multiple-occupant trauma event.", voiceMsg: "Medical Alert. Mass casualty in Atrium. Clear path for EMS." },
];

export default function SimulationPage() {
  const { profile } = useAuth();
  const [activeSim, setActiveSim] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<{ time: string, msg: string, type: string }[]>([]);
  const [callStatus, setCallStatus] = useState({ connected: 0, total: 0, active: false });
  const [callResults, setCallResults] = useState<any[]>([]);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [currentIncidentId, setCurrentIncidentId] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);
  
  // Responder Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "contacts"), (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg: string, type: string = "info") => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { time, msg, type }]);
  };

  const handleAddResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, "contacts"), {
        name: newName,
        phone: newPhone,
        organization: profile?.organizationName || "GLOBAL",
        role: "Emergency Responder"
      });
      setNewName("");
      setNewPhone("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteResponder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
    } catch (err) {
      console.error(err);
    }
  };

  const startSimulation = async (scenario: any) => {
    setIsSimulating(true);
    setActiveSim(scenario);
    setLogs([]);
    setCallResults([]);
    setCallStatus({ connected: 0, total: contacts.length, active: true });
    setAiPlan(null);

    const orgName = profile?.organizationName || "COMMAND CENTER";

    addLog(`INITIALIZING CRISIS SYSTEM: [${orgName}] ${scenario.name.toUpperCase()}`, "alert");
    
    let incidentId = null;
    try {
      const docRef = await addDoc(collection(db, "incidents"), {
        type: scenario.name,
        priority: scenario.priority,
        status: "active",
        location: scenario.location,
        description: `[SIMULATION] ${scenario.desc}`,
        timestamp: Timestamp.now(),
        isSimulation: true,
        organization: orgName
      });
      setCurrentIncidentId(docRef.id);
      addLog(`INCIDENT REGISTERED: ID-${docRef.id.substring(0,6)}`, "success");
    } catch (error) {
      console.error("Firestore Sync Error:", error);
      addLog("DATABASE SYNC DELAYED. PROCEEDING WITH TACTICAL DISPATCH.", "info");
    }

    setTimeout(() => addLog(`SYSTEM STATUS: ALPHA-CLEARANCE GRANTED.`), 800);
    
    setTimeout(async () => {
      addLog(`INITIATING TWILIO VOICE DISPATCH TO ${contacts.length} RESPONDERS...`, "info");
      const numbers = contacts.map(c => c.phone);
      
      // Show dialing state for all
      setCallResults(contacts.map(c => ({ name: c.name, phone: c.phone, status: "dialing" })));

      try {
        const res = await fetch("/api/trigger-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            numbers, 
            message: `Emergency Alert for ${orgName}. ${scenario.voiceMsg}` 
          })
        });
        const data = await res.json();
        
        if (data.results) {
           setCallResults(data.results.map((r: any) => {
              const contact = contacts.find(c => c.phone === r.number);
              return { name: contact?.name || "Unit", phone: r.number, status: r.status };
           }));
        }

        addLog(`VOICE DISPATCH COMPLETE. CONFIRMED: ${data.summary?.successCount || 0}`, "success");
        setCallStatus(prev => ({ ...prev, active: false, connected: data.summary?.successCount || 0 }));
      } catch (e) {
        addLog("TWILIO DISPATCH FAILED: NETWORK ERROR", "alert");
        setCallStatus(prev => ({ ...prev, active: false }));
      }
    }, 2500);

    setTimeout(async () => {
      addLog("ENGAGING AI TACTICAL ENGINE...", "info");
      addLog("TACTICAL DIRECTION: UNIT ALPHA DISPATCHED TO NORTH PERIMETER.", "success");
      addLog("TACTICAL DIRECTION: HAZMAT CONTAINMENT INITIATED IN LAB SECTOR.", "success");
      addLog("TACTICAL DIRECTION: EVACUATE ALL NON-ESSENTIAL PERSONNEL TO ZONE 4.", "alert");
      
      const planRaw = await generateTacticalPlan(`${orgName} — ${scenario.name}`, scenario.location);
      if (planRaw) {
        try {
          const cleanJson = planRaw.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          setAiPlan(parsed);
          addLog("AI TACTICAL PLAN BROADCASTED.", "success");
          addLog("TACTICAL DIRECTION: FOLLOW ASSIGNED AI ROUTES IMMEDIATELY.", "alert");
        } catch (e) {
           console.error("AI Parsing Error:", e);
           setAiPlan({
             criticalAction: "Immediate Evacuation",
             steps: ["Clear all exits", "Activate secondary alarms", "Notify emergency units"],
             assignments: ["Security Team Alpha: Perimeter", "Maintenance: Grid Control"]
           });
          addLog("AI PROTOCOL SYNCED (FALLBACK ACTIVE).", "info");
        }
      }
    }, 5000);
  };

  const resetSim = async () => {
    setIsTerminating(true);
    if (currentIncidentId) {
      try {
        await updateDoc(doc(db, "incidents", currentIncidentId), {
          status: "resolved",
          resolvedAt: Timestamp.now()
        });
      } catch (err) {
        console.error("Failed to resolve incident:", err);
      }
    }
    
    // Tactile delay to ensure user notices the transition
    setTimeout(() => {
      setIsSimulating(false);
      setActiveSim(null);
      setAiPlan(null);
      setLogs([]);
      setCallResults([]);
      setCurrentIncidentId(null);
      setIsTerminating(false);
    }, 1000);
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 p-6 bg-[#0B0F19]",
      isSimulating && "bg-[#FF3B3B]/5 ring-8 ring-inset ring-[#FF3B3B]/10"
    )}>
      
      <div className="max-w-[1700px] mx-auto space-y-8">
        <AnimatePresence mode="wait">
          {!isSimulating ? (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                  <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Simulation Deck</h1>
                    <p className="text-[10px] font-black text-[#9CA3AF] mt-4 font-bold tracking-[0.4em] uppercase">Crisis Coordination & Response Training</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowAddForm(true)}
                      className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs flex items-center gap-3 hover:bg-white/10 uppercase tracking-widest transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Live Responder
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8 rounded-3xl bg-[#111827] border border-[#3B82F6]/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Users className="h-24 w-24 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic mb-6">Register Field Unit</h3>
                      <form onSubmit={handleAddResponder} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Responder Name</label>
                          <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Unit Alpha-1"
                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Phone Number</label>
                          <input 
                            type="tel" 
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="+1234567890"
                            className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                            required
                          />
                        </div>
                        <div className="flex items-end gap-3">
                          <button 
                            type="submit" 
                            disabled={isAdding}
                            className="flex-1 bg-[#3B82F6] text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-widest hover:brightness-110 disabled:opacity-50"
                          >
                            {isAdding ? "Registering..." : "Activate Unit"}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-3.5 rounded-xl bg-white/5 text-[#9CA3AF] font-bold text-xs uppercase tracking-widest"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scenarios.map((s, i) => (
                    <motion.div 
                      key={s.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#111827] p-8 rounded-3xl border border-white/5 cursor-pointer group hover:border-[#3B82F6]/50 transition-all shadow-xl"
                      onClick={() => startSimulation(s)}
                    >
                      <div className={cn("p-5 rounded-2xl bg-white/5 w-fit mb-6 transition-all group-hover:scale-110", s.color)}>
                        <s.icon className="h-10 w-10" />
                      </div>
                      <h3 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter leading-none">{s.name}</h3>
                      <p className="text-sm text-[#9CA3AF] font-bold tracking-tight leading-relaxed">{s.desc}</p>
                      <div className="mt-8 flex items-center justify-between">
                         <span className={cn(
                          "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest",
                          s.priority === "Critical" ? "bg-[#FF3B3B]/10 text-[#FF3B3B] border-[#FF3B3B]/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}>
                          {s.priority}
                        </span>
                        <div className="text-[#3B82F6] font-black text-xs tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all uppercase italic">
                          Initialize <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-[#111827] border border-white/10 rounded-3xl p-8 flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <Users className="h-6 w-6 text-[#3B82F6]" />
                          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Responders</h3>
                       </div>
                       <button 
                         onClick={() => setShowAddForm(true)}
                         className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all"
                       >
                          <Plus className="h-5 w-5" />
                       </button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                       {contacts.map(contact => (
                         <div key={contact.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[#3B82F6]">
                                  {contact.name.charAt(0)}
                               </div>
                               <div>
                                  <div className="text-xs font-black text-white uppercase">{contact.name}</div>
                                  <div className="text-[10px] font-bold text-[#9CA3AF] tracking-widest mt-0.5">{contact.phone}</div>
                               </div>
                            </div>
                            <button onClick={() => handleDeleteResponder(contact.id)} className="opacity-0 group-hover:opacity-100 p-2 text-[#FF3B3B] hover:bg-[#FF3B3B]/10 rounded-lg transition-all">
                               <Trash2 className="h-4 w-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
                 {/* ADD FORM MODAL */}
                 <AnimatePresence>
                    {showAddForm && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#111827] border border-[#3B82F6]/30 rounded-3xl p-8 shadow-2xl">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Register Unit</h4>
                            <button onClick={() => setShowAddForm(false)} className="text-[#9CA3AF] hover:text-white"><X className="h-4 w-4" /></button>
                         </div>
                         <form onSubmit={handleAddResponder} className="space-y-4">
                            <input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white" />
                            <input type="tel" placeholder="+1..." value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white" />
                            <button className="w-full py-3 rounded-xl bg-[#3B82F6] text-white font-black text-xs uppercase">Authorize</button>
                         </form>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-12">
                <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="bg-[#FF3B3B] p-12 rounded-[3rem] text-center relative overflow-hidden shadow-[0_0_80px_rgba(255,59,59,0.2)]">
                  <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 bg-white/10" />
                  <div className="relative z-10">
                    <h2 className="text-8xl font-black text-white tracking-tighter mb-2 italic drop-shadow-2xl">🚨 {activeSim.name.toUpperCase()}</h2>
                    <p className="text-3xl font-black text-white/80 uppercase tracking-[0.4em] italic">{profile?.organizationName} — {activeSim.location}</p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-8">
                {/* LOGS */}
                <div className="bg-[#111827] border border-white/10 h-[400px] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <Terminal className="h-4 w-4 text-[#3B82F6]" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">System Logs</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono custom-scrollbar">
                    {logs.map((log, i) => (
                      <div key={i} className={cn("text-[10px] leading-relaxed flex gap-4", log.type === "alert" ? "text-[#FF3B3B] font-black" : "text-[#E5E7EB]")}>
                        <span className="text-[#9CA3AF] opacity-50">[{log.time}]</span>
                        <span>{log.msg}</span>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>

                {/* CALL RESULTS LIST (NEW) */}
                <div className="bg-[#111827] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic">Dispatch Registry</h3>
                      <PhoneCall className={cn("h-4 w-4 text-[#3B82F6]", callStatus.active && "animate-bounce")} />
                   </div>
                   <div className="space-y-3">
                      {callResults.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#0B0F19] border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                res.status === "dialing" ? "bg-[#3B82F6] animate-pulse" :
                                res.status === "success" ? "bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-[#FF3B3B]"
                              )} />
                              <div>
                                 <div className="text-[10px] font-black text-white uppercase">{res.name}</div>
                                 <div className="text-[8px] font-bold text-[#9CA3AF] mt-0.5">{res.phone}</div>
                              </div>
                           </div>
                           <span className={cn(
                             "text-[8px] font-black uppercase tracking-widest italic",
                             res.status === "dialing" ? "text-[#3B82F6]" :
                             res.status === "success" ? "text-green-500" : "text-[#FF3B3B]"
                           )}>
                              {res.status}
                           </span>
                        </div>
                      ))}
                      {callResults.length === 0 && (
                        <div className="text-center py-10 opacity-20 text-[10px] font-black uppercase tracking-widest">
                           Waiting for dispatch...
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* AI TACTICAL PLAN (IMPROVED VISUALS) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                <AnimatePresence mode="wait">
                  {aiPlan ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#6366F1]/5 border-2 border-[#6366F1]/30 rounded-[2.5rem] p-12 h-full shadow-2xl flex flex-col relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-5">
                          <Cpu className="h-64 w-64 text-white" />
                       </div>
                       <div className="flex items-center gap-6 mb-12 pb-8 border-b border-[#6366F1]/20 relative z-10">
                          <div className="h-20 w-20 rounded-3xl bg-[#6366F1]/20 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                             <Cpu className="h-12 w-12 text-[#6366F1]" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Gemini Tactical Strategy</h3>
                             <p className="text-[#6366F1] font-black tracking-[0.4em] text-[10px] uppercase mt-2">Active Decision Support Protocol</p>
                          </div>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-12 relative z-10 flex-1">
                          <div className="space-y-12">
                             <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.5em] flex items-center gap-3">
                                   <Zap className="h-4 w-4" /> Primary Counter-Action
                                </h4>
                                <div className="p-8 rounded-[2rem] bg-[#6366F1]/10 border border-[#6366F1]/20 text-white font-black text-3xl italic tracking-tight leading-tight ring-4 ring-[#6366F1]/5 shadow-2xl">
                                   "{aiPlan.criticalAction}"
                                </div>
                             </div>
                             <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.5em] flex items-center gap-3">
                                   <Activity className="h-4 w-4" /> Strategic Milestones
                                </h4>
                                <div className="space-y-4">
                                   {aiPlan.steps.map((s:any, i:any) => (
                                     <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.2 }} key={i} className="flex gap-6 items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="h-10 w-10 rounded-xl bg-[#6366F1]/20 flex items-center justify-center text-xs font-black text-[#6366F1] italic">0{i+1}</div>
                                        <p className="text-sm text-white/90 font-black italic uppercase tracking-wide">{s}</p>
                                     </motion.div>
                                   ))}
                                </div>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.5em] flex items-center gap-3">
                                <Users className="h-4 w-4" /> Active Unit Deployments
                             </h4>
                             <div className="grid grid-cols-1 gap-4">
                                {aiPlan.assignments.map((a:any, i:any) => (
                                  <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.15 }} key={i} className="p-6 rounded-2xl bg-[#0B0F19] border border-white/10 flex items-center gap-6 group hover:border-[#6366F1]/50 transition-all shadow-xl">
                                     <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5 text-[#6366F1]" />
                                     </div>
                                     <span className="text-xs font-black text-white/80 uppercase italic tracking-widest">{a}</span>
                                  </motion.div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <div className="bg-[#111827] border border-white/5 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-20 text-center shadow-2xl relative overflow-hidden">
                       <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-5">
                          <Cpu className="h-[800px] w-[800px] text-white -translate-x-1/4 -translate-y-1/4" />
                       </motion.div>
                       <Loader2 className="h-24 w-24 text-[#3B82F6]/40 animate-spin mb-8 relative z-10" />
                       <h3 className="text-3xl font-black text-white/40 uppercase tracking-[0.8em] italic relative z-10 leading-none">Synthesizing Ops</h3>
                       <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-6 relative z-10">Gemini Neural Link Established... Generating Tactical Plan</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-12 flex justify-center py-10">
                <button 
                  onClick={resetSim} 
                  disabled={isTerminating}
                  className="px-20 py-6 rounded-full bg-white/5 border border-white/10 text-white font-black hover:bg-[#FF3B3B] transition-all uppercase tracking-[0.6em] text-[10px] flex items-center gap-6 shadow-2xl hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTerminating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  {isTerminating ? "Terminating crisis protocol..." : "Terminate Crisis Protocol"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
