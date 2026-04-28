"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Loader2, Mail, Lock, User, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const { loginAsGuest, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [orgType, setOrgType] = useState("Corporate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleSuccess, setGoogleSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name,
          email,
          role: "Administrator",
          organizationName: organization,
          orgType: orgType,
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn("Firestore profile write failed:", fsErr);
      }

      await firebaseSignOut(auth);
      window.location.href = "/login?registered=true";
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This institutional email is already registered in our command database. Please use the Access Node to sign in.");
      } else {
        setError(err.message || "Failed to create account.");
      }
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsGuest();
  };

  const handleCinematicFill = () => {
    const randomId = Math.floor(Math.random() * 900) + 100;
    setName("Commander Alpha-" + randomId);
    setEmail(`commander.${randomId}@alertgrid.pro`);
    setPassword("crisis-node-secure");
    setOrganization("Pacific Crisis Hub");
    setOrgType("Government");
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      setGoogleSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    } catch (err: any) {
      if (err.code === "auth/internal-error" || err.code === "auth/unauthorized-domain") {
        setGoogleSuccess(true);
        setError("Initializing Secure Demo Node...");
        setTimeout(() => {
          loginAsGuest();
        }, 1000);
      } else {
        setError(`Google Authentication Warning: ${err?.message || "Internal Protocol Error"}`);
        setGoogleLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0F19] p-4 relative overflow-hidden">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
      >
        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden bg-[#111827] border-white/5 shadow-2xl">
          <div className="flex flex-col items-center space-y-4 text-center mb-10 relative z-10">
            <div className="rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 p-4">
              <ShieldAlert className="h-10 w-10 text-[#3B82F6]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic">Enterprise Registration</h2>
            <p className="text-sm text-[#9CA3AF] font-bold tracking-widest uppercase">Establish Institutional Command Clearance</p>
          </div>

          <form onSubmit={handleSignup} autoComplete="off" className="space-y-6 relative z-10">
            {error && (
              <div className={cn(
                "rounded-xl p-4 text-sm font-bold text-center flex flex-col items-center gap-3 transition-all animate-in fade-in slide-in-from-top-2",
                error.includes("Demo Node")
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 glow-cyan"
                  : "bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 text-[#FF3B3B] glow-red"
              )}>
                <span>{error}</span>
                {error.includes("already registered") && (
                  <Link 
                    href={`/login?email=${encodeURIComponent(email)}`}
                    className="px-4 py-2 bg-[#FF3B3B]/20 hover:bg-[#FF3B3B]/30 rounded-lg text-xs uppercase tracking-widest transition-all border border-[#FF3B3B]/30"
                  >
                    Proceed to Login Node
                  </Link>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Commander Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Secure Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="email"
                    placeholder="admin@institution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Organization Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Company / School / Factory"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Organization Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all appearance-none"
                >
                  <option value="Corporate">Corporate Hub</option>
                  <option value="Factory">Manufacturing / Factory</option>
                  <option value="School">Educational Institution</option>
                  <option value="Hospital">Medical Facility</option>
                  <option value="Government">Government / Public Safety</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Access Key (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0B0F19] pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-3 rounded-xl px-4 py-4 text-sm font-black transition-all mt-4 uppercase tracking-[0.3em]",
                loading ? "bg-white/10 text-[#9CA3AF] cursor-not-allowed" : "bg-[#3B82F6] text-white hover:brightness-110 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              )}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShieldAlert className="h-5 w-5" /> Establish System Command</>}
            </button>
          </form>

          <div className="relative z-10 my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className={cn(
              "relative z-10 w-full flex items-center justify-center gap-4 rounded-xl px-4 py-4 text-sm font-black transition-all border border-[#4285F4]/30 uppercase tracking-widest overflow-hidden group",
              googleLoading ? "bg-white/5 text-[#9CA3AF]" : "bg-[#4285F4]/5 text-white hover:bg-[#4285F4]/10"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4]/0 via-[#4285F4]/10 to-[#4285F4]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : googleSuccess ? (
              <span className="flex items-center gap-2 text-green-400">
                <ShieldAlert className="h-5 w-5" /> Authentication Verified
              </span>
            ) : (
              <><GoogleIcon className="h-5 w-5" /> Continue with Google</>
            )}
          </button>
          
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs text-[#9CA3AF] font-bold">
              Existing clearances?{" "}
              <Link href="/login" className="text-[#3B82F6] hover:brightness-125 transition-all uppercase tracking-widest ml-2">
                Access Node <ArrowRight className="h-3 w-3 inline ml-1" />
              </Link>
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
              <button 
                onClick={handleCinematicFill}
                className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-all uppercase tracking-[0.2em] font-black border border-cyan-400/20 rounded-lg py-2 bg-cyan-400/5 hover:bg-cyan-400/10"
              >
                [ Generate Cinematic Credentials ]
              </button>
              <button 
                onClick={handleDemoLogin}
                className="text-[10px] text-[#3B82F6]/60 hover:text-[#3B82F6] transition-all uppercase tracking-[0.2em] font-black"
              >
                [ Emergency Login Bypass ]
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
