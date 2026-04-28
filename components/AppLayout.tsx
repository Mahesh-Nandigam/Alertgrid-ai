"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { AuthProvider } from "@/context/AuthContext";
import { AutomationEngine } from "@/components/AutomationEngine";
import { useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/";

  return (
    <AuthProvider>
      {!isAuthRoute && <AutomationEngine />}
      {isAuthRoute ? (
        <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
          {/* Ambient Background for Auth Routes */}
          <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          {children}
        </main>
      ) : (
        <div className="flex w-full min-h-screen bg-background text-foreground overflow-hidden">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className={cn(
            "fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform md:relative md:translate-x-0 md:z-auto",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
            <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
              {children}
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}
