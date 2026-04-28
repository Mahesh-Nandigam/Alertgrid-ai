"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-[#3B82F6] border-t-transparent animate-spin shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
        <p className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Initializing Command Link...</p>
      </div>
    </div>
  );
}
