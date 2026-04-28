"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ShieldAlert, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ResetDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const clearCollection = async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map((d) => deleteDoc(doc(db, collectionName, d.id)));
    await Promise.all(deletePromises);
  };

  const handleFullReset = async () => {
    if (!confirm("Are you sure? This will wipe ALL incidents, contacts, and user profiles!")) return;
    
    setLoading(true);
    setStatus("Initiating System Wipe...");
    
    try {
      setStatus("Clearing Incidents...");
      await clearCollection("incidents");
      
      setStatus("Clearing Responders...");
      await clearCollection("contacts");
      
      setStatus("Clearing User Profiles...");
      await clearCollection("users");
      
      setStatus("System Wipe Complete.");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("Reset error:", error);
      setStatus("Error: System Wipe Interrupted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111827] border border-[#FF3B3B]/20 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,59,59,0.1)]"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-[#FF3B3B]" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Emergency Wipe</h1>
            <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mt-2">Clear all database entries for fresh demo</p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleFullReset}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#FF3B3B] text-white font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(255,59,59,0.3)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {loading ? "Wiping Systems..." : "Full System Reset"}
            </button>
            
            {status && (
              <div className="flex items-center justify-center gap-3 text-sm font-bold animate-pulse">
                {status.includes("Complete") ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Loader2 className="h-4 w-4 text-[#3B82F6] animate-spin" />}
                <span className={status.includes("Complete") ? "text-green-500" : "text-[#3B82F6]"}>
                  {status}
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 w-full">
            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest leading-relaxed">
              WARNING: This action cannot be undone. All data in Firestore will be permanently removed.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
