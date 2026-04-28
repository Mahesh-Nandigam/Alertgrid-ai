"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateTacticalPlan } from "@/lib/gemini";
import { AlertTriangle, Loader2, Sparkles, Send, ShieldAlert, Activity, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function IncidentsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate AI Tactical Plan
      const planRaw = await generateTacticalPlan(title, location);
      let planDisplay = "";

      if (planRaw) {
        try {
          const cleanJson = planRaw.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          planDisplay = `
            <div class="space-y-4">
              <div class="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p class="text-xs font-black uppercase tracking-widest text-primary mb-1">Critical Action</p>
                <p class="text-lg font-black italic text-white leading-tight">${parsed.criticalAction}</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 italic">Tactical Milestones</p>
                <ul class="space-y-2 list-none p-0">
                  ${parsed.steps.map((s: string) => `<li class="flex gap-3 items-center text-xs text-white/80 font-bold italic bg-white/5 p-2 rounded-lg border border-white/5"><div class="h-1.5 w-1.5 rounded-full bg-primary"></div> ${s}</li>`).join('')}
                </ul>
              </div>
              <div class="pt-4 border-t border-white/5">
                <p class="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Safety Precaution</p>
                <p class="text-xs font-bold text-white/60 italic">${parsed.precaution}</p>
              </div>
            </div>
          `;
        } catch (e) {
          planDisplay = planRaw;
        }
      }

      setAiResponse(planDisplay);

      // Save to Firebase
      try {
        await addDoc(collection(db, "incidents"), {
          title,
          description,
          location,
          severity,
          aiPlan: planDisplay,
          status: "Active",
          timestamp: new Date()
        });
      } catch (dbErr) {
        console.warn("Could not save to db due to missing config, but AI generated response.");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          Incident Reporting & AI Analysis
        </h1>
        <p className="text-sm text-muted-foreground">
          Log an emergency event to trigger the automated AI coordination protocol.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Section */}
        <div className="glass-panel rounded-xl p-6 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Incident Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Server Room Overheating"
                className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Basement Floor"
                  className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors appearance-none"
                >
                  <option value="low">Low (Standard)</option>
                  <option value="medium">Medium (Warning)</option>
                  <option value="critical">Critical (Emergency)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide situational context..."
                className="min-h-[120px] w-full rounded-md border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-all",
                loading ? "bg-white/10 text-muted-foreground cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 glow-blue"
              )}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Run AI Analysis Protocol</>}
            </button>
          </form>
        </div>

        {/* AI Response Section */}
        <div className="glass-panel rounded-xl flex flex-col overflow-hidden border border-white/10 relative">
          <div className="bg-black/60 border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Gemini AI Action Plan</h2>
            </div>
            {loading && <span className="text-xs font-medium text-primary animate-pulse flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Processing...</span>}
          </div>

          <div className="flex-1 p-6 overflow-y-auto relative">
            {/* Ambient background for empty state */}
            {!aiResponse && <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50" />}

            {aiResponse ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-sm prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-white prose-li:text-muted-foreground prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-3 relative z-10">
                <div className="p-4 rounded-full bg-white/5 border border-white/10">
                  <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
                <p className="text-sm text-center max-w-[250px]">Awaiting incident input to synthesize response protocol.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
