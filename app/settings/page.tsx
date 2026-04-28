"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Key, 
  Globe, 
  Save, 
  Lock,
  Phone,
  Monitor,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const { profile, user } = useAuth();
  
  // Theme State
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Form State
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    organization: profile?.organizationName || "",
    emergencyAlerts: true,
    callAlerts: true,
    twilioSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || "",
    twilioToken: "************************" // Masked for UI
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Apply Theme
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [theme]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        organizationName: formData.organization,
        settings: {
          emergencyAlerts: formData.emergencyAlerts,
          callAlerts: formData.callAlerts,
          theme: theme
        }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-10 max-w-[1000px] mx-auto bg-[#0B0F19] min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">System Configuration</h1>
          <p className="text-[#9CA3AF] font-bold tracking-widest text-[10px] uppercase mt-4">Node Security Settings | Version 4.0.1</p>
        </div>
        <div className="flex items-center gap-4">
           {success && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest"
             >
                <CheckCircle2 className="h-4 w-4" /> Sync Complete
             </motion.div>
           )}
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-10 py-4 rounded-2xl bg-[#3B82F6] text-white font-black text-xs uppercase tracking-[0.2em] hover:brightness-110 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all flex items-center gap-3"
           >
             {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
             Commit Changes
           </button>
        </div>
      </div>

      <div className="space-y-12">
        {/* SECTION 1: PROFILE */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-[#3B82F6]">
              <User className="h-6 w-6" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] italic">User Profile</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111827] p-10 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3 w-3" /> Full Name
                 </label>
                 <input 
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Mail className="h-3 w-3" /> System Email
                 </label>
                 <input 
                   type="email" 
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                 />
              </div>
           </div>
        </section>

        {/* SECTION 2: ORGANIZATION */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-[#3B82F6]">
              <Building2 className="h-6 w-6" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] italic">Enterprise Identity</h2>
           </div>
           <div className="bg-[#111827] p-10 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> Organization Name
                 </label>
                 <input 
                   type="text" 
                   value={formData.organization}
                   onChange={(e) => setFormData({...formData, organization: e.target.value})}
                   className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                 />
              </div>
           </div>
        </section>

        {/* SECTION 3: APPEARANCE */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-[#3B82F6]">
              <Monitor className="h-6 w-6" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] italic">System Appearance</h2>
           </div>
           <div className="bg-[#111827] p-10 rounded-[2rem] border border-white/5 shadow-2xl flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="text-sm font-black text-white uppercase italic">Active Interface Theme</h4>
                 <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">Toggle between high-contrast dark and light modes</p>
              </div>
              <div className="flex bg-[#0B0F19] p-1.5 rounded-2xl border border-white/5">
                 <button 
                   onClick={() => setTheme("dark")}
                   className={cn(
                     "flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                     theme === "dark" ? "bg-[#3B82F6] text-white shadow-lg" : "text-[#9CA3AF] hover:text-white"
                   )}
                 >
                    <Moon className="h-3.5 w-3.5" /> Dark
                 </button>
                 <button 
                   onClick={() => setTheme("light")}
                   className={cn(
                     "flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                     theme === "light" ? "bg-white text-black shadow-lg" : "text-[#9CA3AF] hover:text-white"
                   )}
                 >
                    <Sun className="h-3.5 w-3.5" /> Light
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 4: NOTIFICATIONS */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-[#3B82F6]">
              <Bell className="h-6 w-6" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] italic">Global Alerts</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#111827] p-10 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase">Emergency Alerts</h4>
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">Real-time crisis triggers</p>
                 </div>
                 <button 
                   onClick={() => setFormData({...formData, emergencyAlerts: !formData.emergencyAlerts})}
                   className={cn(
                     "h-7 w-12 rounded-full transition-all flex items-center px-1 border",
                     formData.emergencyAlerts ? "bg-green-500 border-green-400" : "bg-white/10 border-white/10"
                   )}
                 >
                    <div className={cn("h-5 w-5 rounded-full bg-white shadow-md transition-all", formData.emergencyAlerts ? "ml-auto" : "ml-0")} />
                 </button>
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <h4 className="text-xs font-black text-white uppercase">Voice Call Alerts</h4>
                    <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest">Twilio dispatch confirmations</p>
                 </div>
                 <button 
                   onClick={() => setFormData({...formData, callAlerts: !formData.callAlerts})}
                   className={cn(
                     "h-7 w-12 rounded-full transition-all flex items-center px-1 border",
                     formData.callAlerts ? "bg-green-500 border-green-400" : "bg-white/10 border-white/10"
                   )}
                 >
                    <div className={cn("h-5 w-5 rounded-full bg-white shadow-md transition-all", formData.callAlerts ? "ml-auto" : "ml-0")} />
                 </button>
              </div>
           </div>
        </section>

        {/* SECTION 5: TWILIO */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 text-[#3B82F6]">
              <Key className="h-6 w-6" />
              <h2 className="text-lg font-black uppercase tracking-[0.3em] italic">Telephony Core</h2>
           </div>
           <div className="bg-[#111827] p-10 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5" /> Account SID
                 </label>
                 <input 
                   type="text" 
                   value={formData.twilioSid}
                   onChange={(e) => setFormData({...formData, twilioSid: e.target.value})}
                   className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                   placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" /> Auth Token
                 </label>
                 <input 
                   type="password" 
                   value={formData.twilioToken}
                   onChange={(e) => setFormData({...formData, twilioToken: e.target.value})}
                   className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all font-mono"
                 />
              </div>
           </div>
        </section>
      </div>

      {/* FOOTER SYNC STATUS */}
      <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-3xl p-8 flex items-center justify-between shadow-2xl">
         <div className="flex items-center gap-6">
            <div className="h-12 w-12 rounded-2xl bg-[#3B82F6]/20 flex items-center justify-center">
               <Shield className="h-6 w-6 text-[#3B82F6]" />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Security Persistence</h4>
               <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Last synced: {new Date().toLocaleTimeString()}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-[#3B82F6] uppercase tracking-widest">Authenticated & Secure</span>
         </div>
      </div>
    </div>
  );
}
