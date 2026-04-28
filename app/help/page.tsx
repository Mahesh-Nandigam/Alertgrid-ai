"use client";

import React from "react";
import { 
  HelpCircle, 
  BookOpen, 
  Play, 
  PhoneCall, 
  ShieldCheck, 
  Terminal,
  ChevronRight,
  MessageSquare,
  LifeBuoy,
  Cpu,
  Radio,
  Zap,
  Users,
  Map as MapIcon,
  LayoutDashboard,
  ClipboardList,
  Info,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  return (
    <div className="p-6 space-y-12 max-w-[1200px] mx-auto bg-[#0B0F19] min-h-screen pb-20">
      
      {/* 1. OVERVIEW */}
      <div className="text-center space-y-4 py-16 bg-[#111827] border border-white/5 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5">
            <HelpCircle className="h-40 w-40 text-white" />
         </div>
         <div className="h-20 w-20 rounded-3xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(59,130,246,0.1)] mb-6">
            <LifeBuoy className="h-10 w-10 text-[#3B82F6]" />
         </div>
         <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Command Center Help</h1>
         <p className="text-[#9CA3AF] max-w-2xl mx-auto font-bold tracking-widest text-xs uppercase leading-relaxed mt-4">
            AlertGrid AI helps organizations manage and respond to emergencies in real-time through intelligent automation and voice dispatch.
         </p>
      </div>

      {/* 2. HOW TO USE (STEP-BY-STEP) */}
      <section className="space-y-8">
         <div className="flex items-center gap-4 text-[#3B82F6] border-b border-white/5 pb-4">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase tracking-widest italic text-white">Operational Protocol</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Add Responders",
                desc: "Navigate to the Simulation page. Use the 'Authorized Responders' panel to add phone numbers (include country code, e.g., +1 for US).",
                icon: Users
              },
              {
                step: "02",
                title: "Run Simulation",
                desc: "Select a high-impact scenario from the Simulation library (e.g., Structural Fire). Click 'Trigger Flow' to begin the crisis sequence.",
                icon: Play
              },
              {
                step: "03",
                title: "What Happens",
                desc: "The system triggers real voice calls via Twilio, updates the live Dashboard, and generates AI tactical plans and audit logs.",
                icon: Radio
              }
            ].map((step, i) => (
              <div key={i} className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 relative group hover:border-[#3B82F6]/30 transition-all shadow-xl">
                 <div className="text-4xl font-black text-[#3B82F6]/20 absolute top-6 right-8 group-hover:text-[#3B82F6]/40 transition-all">{step.step}</div>
                 <step.icon className="h-8 w-8 text-[#3B82F6] mb-6" />
                 <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4">{step.title}</h3>
                 <p className="text-xs text-[#9CA3AF] font-bold leading-relaxed uppercase tracking-wider">{step.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 3. FEATURE EXPLANATION */}
      <section className="space-y-8">
         <div className="flex items-center gap-4 text-[#3B82F6] border-b border-white/5 pb-4">
            <Zap className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase tracking-widest italic text-white">Module Reference</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Dashboard", desc: "Live operational hub showing company insights, active alerts, and response metrics.", icon: LayoutDashboard },
              { title: "Simulation", desc: "Test system readiness by triggering dynamic emergency scenarios with real voice dispatch.", icon: Play },
              { title: "Tactical Map", desc: "Visualize incident locations on a top-view facility blueprint with live alert animations.", icon: MapIcon },
              { title: "Intelligence", desc: "Access AI-generated insights and tactical strategies powered by Gemini 1.5-Flash.", icon: Cpu },
              { title: "Compliance", desc: "Review detailed audit logs and incident reports for institutional safety and reporting.", icon: ClipboardList }
            ].map((feature, i) => (
              <div key={i} className="bg-[#111827] p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:bg-white/[0.02] transition-all">
                 <div className="h-12 w-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center shrink-0">
                    <feature.icon className="h-6 w-6 text-[#3B82F6]" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{feature.title}</h4>
                    <p className="text-[11px] text-[#9CA3AF] font-bold mt-2 leading-relaxed uppercase tracking-widest">{feature.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* 4. FAQ SECTION */}
      <section className="space-y-8">
         <div className="flex items-center gap-4 text-[#3B82F6] border-b border-white/5 pb-4">
            <Info className="h-6 w-6" />
            <h2 className="text-xl font-black uppercase tracking-widest italic text-white">Troubleshooting</h2>
         </div>
         
         <div className="grid grid-cols-1 gap-4">
            {[
              { q: "Why am I not receiving calls?", a: "Verify your Twilio Account SID and Auth Token in the Settings page. Ensure the responder's phone number is verified in your Twilio console if using a trial account." },
              { q: "Why is the simulation not starting?", a: "Check your API keys in Settings. Ensure you have a stable internet connection and that the responder registry is not empty." },
              { q: "Can I add multiple responders?", a: "Yes. The system supports broadcasting to multiple authorized units simultaneously during a single simulation event." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#111827] p-8 rounded-2xl border border-white/5 space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-[#3B82F6]" />
                    {faq.q}
                 </h4>
                 <p className="text-[11px] text-[#9CA3AF] font-bold leading-relaxed pl-7 uppercase tracking-wider">
                    → {faq.a}
                 </p>
              </div>
            ))}
         </div>
      </section>

      {/* 5. SUPPORT */}
      <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-3xl p-12 text-center space-y-6">
         <MessageSquare className="h-10 w-10 text-[#3B82F6] mx-auto" />
         <h4 className="text-lg font-black text-white uppercase tracking-widest italic">Institutional Support</h4>
         <p className="text-[10px] text-[#9CA3AF] font-black uppercase tracking-[0.3em] max-w-xl mx-auto leading-relaxed">
            For advanced technical support, contact your system administrator or review the full institutional documentation.
         </p>
      </div>
    </div>
  );
}
