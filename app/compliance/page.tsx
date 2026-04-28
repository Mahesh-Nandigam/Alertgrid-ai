"use client";

import React, { useState } from "react";
import { 
  ShieldCheck as ShieldIcon, 
  FileText as FileIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  History as HistoryIcon, 
  HardDrive as HardDriveIcon, 
  Download as DownloadIcon, 
  Share2 as ShareIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  CheckCircle as CheckCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Activity as ActivityIcon, 
  FileCode as FileCodeIcon, 
  Archive as ArchiveIcon, 
  RefreshCcw as RefreshIcon, 
  Zap as ZapIcon,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";

interface Report {
  id: string;
  title: string;
  date: string;
  type: "Incident Audit" | "SLA Report" | "Risk Assessment" | "System Health";
  status: "Completed" | "Processing" | "Archived";
  size: string;
}

export default function CompliancePage() {
  const { profile } = useAuth();
  const [reports] = useState<Report[]>([
    { id: "r1", title: `Q1 Security Audit - ${profile?.organizationName}`, date: "2024-04-15", type: "Incident Audit", status: "Completed", size: "2.4 MB" },
    { id: "r2", title: `${profile?.organizationName} SLA Performance`, date: "2024-04-01", type: "SLA Report", status: "Completed", size: "1.1 MB" },
    { id: "r3", title: "Institutional Risk Analysis v4", date: "2024-03-22", type: "Risk Assessment", status: "Archived", size: "5.8 MB" },
    { id: "r4", title: "Global Grid Integrity Log", date: "2024-04-20", type: "System Health", status: "Processing", size: "---" },
  ]);

  const [generating, setGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleGenerateAuditLog = () => {
    setGenerating(true);
    setDownloaded(false);

    // Simulate synthesis time for realism
    setTimeout(() => {
      const doc = new jsPDF();
      const now = new Date().toLocaleString();
      const timestamp = () => new Date().toLocaleTimeString();

      // Header Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Audit Log Report", 20, 30);
      
      doc.setLineWidth(0.1);
      doc.line(20, 35, 190, 35);

      // Metadata Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Document Metadata", 20, 50);
      
      doc.setFont("helvetica", "normal");
      doc.text(`User Name: Mahesh Nandigam`, 20, 60);
      doc.text(`Generation Date: ${now}`, 20, 70);

      // Activity Section
      doc.setFont("helvetica", "bold");
      doc.text("User Activity Summary", 20, 90);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const entries = [
        `[${timestamp()}] System access established via institutional node.`,
        `[${timestamp()}] Cognitive Intel grid recalculation triggered manually.`,
        `[${timestamp()}] Tactical map layer 'Blueprint v4.2' synchronized.`,
        `[${timestamp()}] Readiness simulation protocol initialized successfully.`,
        `[${timestamp()}] Automated compliance integrity audit completed.`
      ];

      let yOffset = 105;
      entries.forEach(entry => {
        doc.text(entry, 20, yOffset);
        yOffset += 10;
      });

      // Footer Section
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("Confidential • AlertGrid AI Compliance Registry System", 20, 280);
      doc.text("Digitally generated report - Institutional Command Node.", 20, 286);

      doc.save(`audit_log_${new Date().getTime()}.pdf`);
      
      setGenerating(false);
      setDownloaded(true);

      // Reset success message after a few seconds
      setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-10 max-w-[1600px] mx-auto bg-[#0B0F19] min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
            <ShieldIcon className="h-14 w-14 text-[#3B82F6]" />
            Audit Protocol
          </h1>
          <p className="text-[#9CA3AF] mt-4 font-bold tracking-[0.4em] text-[10px] uppercase italic">
            Automated Compliance & Reporting for {profile?.organizationName}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGenerateAuditLog}
            disabled={generating}
            className={cn(
              "px-10 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-3",
              generating ? "bg-white/10 cursor-not-allowed" : 
              downloaded ? "bg-green-500/20 border border-green-500/30 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]" : 
              "bg-[#3B82F6] hover:brightness-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            )}
          >
            <FileIcon className={cn("h-4 w-4", generating && "animate-spin")} />
            {generating ? "Generating..." : downloaded ? "Audit Log Downloaded" : "Generate Audit Log"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* COMPLIANCE STATUS HERO */}
          <div className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-10 opacity-5">
                <ShieldIcon className="h-40 w-40 text-white" />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 mb-10">
                <div className="flex items-center gap-8">
                   <div className="h-20 w-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                      <ShieldIcon className="h-10 w-10" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Institutional Sync: Optimal</h2>
                      <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-2">
                        Last institutional audit verified for {profile?.organizationName} on April 22, 2024.
                      </p>
                   </div>
                </div>
                <div className="text-center md:text-right">
                   <div className="text-5xl font-black text-white italic tracking-tighter">99.2%</div>
                   <div className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.4em] mt-2">SLA Integrity Score</div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               {[
                 { label: "Data Retention", value: "365 Days", icon: HardDriveIcon },
                 { label: "Alert Latency", value: "< 1.2s", icon: ClockIcon },
                 { label: "Success Rate", value: "100%", icon: CheckCircleIcon },
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-6 group hover:bg-white/5 transition-all">
                   <item.icon className="h-6 w-6 text-[#3B82F6]" />
                   <div>
                     <div className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none mb-1">{item.label}</div>
                     <div className="text-xl font-black text-white italic leading-none">{item.value}</div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* REPORTS REPOSITORY */}
          <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] flex items-center gap-3">
                <HistoryIcon className="h-4 w-4 text-[#3B82F6]" />
                Institutional Registry
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF] group-focus-within:text-[#3B82F6]" />
                  <input type="text" placeholder="Filter audit logs..." className="bg-[#0B0F19] border border-white/10 rounded-xl pl-12 pr-6 py-3 text-[10px] font-bold text-white uppercase focus:outline-none focus:ring-1 focus:ring-[#3B82F6] w-64 transition-all" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic">Document Identity</th>
                    <th className="p-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic">Audit Classification</th>
                    <th className="p-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic text-center">Persistence</th>
                    <th className="p-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic">Timestamp</th>
                    <th className="p-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest italic text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-5">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors">
                             <FileIcon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-black text-white uppercase italic">{report.title}</span>
                            <span className="text-[9px] text-[#9CA3AF] font-bold tracking-widest">{report.size} • GRID-SECURED</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{report.type}</span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                          report.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                          report.status === "Processing" ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 animate-pulse" :
                          "bg-white/5 text-[#9CA3AF] border-white/5"
                        )}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3 text-[10px] font-black text-[#9CA3AF] uppercase">
                          <CalendarIcon className="h-3.5 w-3.5 text-[#3B82F6]" /> {report.date}
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-white/10 transition-all flex items-center justify-center">
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                          <button className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-[#9CA3AF] hover:text-white hover:bg-white/10 transition-all flex items-center justify-center">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COMPLIANCE SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4">
               <ActivityIcon className="h-6 w-6 text-[#3B82F6]" />
               <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Compliance Health</h3>
            </div>
            
            <div className="space-y-10">
              {[
                { label: "Institutional Security Grade", score: 88, color: "bg-[#3B82F6]" },
                { label: "Privacy Protocol Alignment", score: 100, color: "bg-green-500" },
                { label: "Critical Response SLA", score: 94, color: "bg-orange-500" },
              ].map((std, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">{std.label}</span>
                    <span className="text-xl font-black text-white italic">{std.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#0B0F19] rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${std.score}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]", std.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FF3B3B]/5 p-10 rounded-[2.5rem] border border-[#FF3B3B]/20 shadow-2xl group">
            <div className="flex items-center gap-4 text-[#FF3B3B] mb-6">
              <AlertCircleIcon className="h-6 w-6 animate-pulse" />
              <h3 className="text-sm font-black uppercase italic tracking-tighter">System Discrepancy</h3>
            </div>
            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest leading-relaxed mb-8">
              Minor response time violations detected in {profile?.organizationName} Sector B-4 during Shift Alpha.
            </p>
            <button className="w-full py-4 rounded-2xl bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 text-[#FF3B3B] text-[10px] font-black uppercase tracking-widest hover:bg-[#FF3B3B] hover:text-white transition-all shadow-xl">
              Initiate Investigation
            </button>
          </div>

          <div className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
               <ArchiveIcon className="h-6 w-6 text-[#3B82F6]" />
               <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Global Exports</h3>
            </div>
            <div className="space-y-4">
              {[
                { type: "JSON Institutional Data", icon: FileCodeIcon },
                { type: "PDF Tactical Audit", icon: FileIcon },
                { type: "XLS Grid Logs", icon: ActivityIcon },
              ].map((item, i) => (
                <button key={i} className="w-full text-left p-5 rounded-2xl bg-[#0B0F19] border border-white/5 hover:border-[#3B82F6]/50 transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <item.icon className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors" />
                      <span className="text-[10px] font-black text-[#9CA3AF] group-hover:text-white uppercase tracking-widest transition-colors">{item.type}</span>
                   </div>
                   <DownloadIcon className="h-3.5 w-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
