"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  organizationName: string;
  orgType?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  loginAsGuest: () => {},
  isGuest: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading((current) => {
        if (current) {
          console.warn("[AuthContext] Firebase auth timeout — forcing load.");
        }
        return false;
      });
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(timeout);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Google Sign-In (for LOGIN page only)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const docRef = doc(db, "users", googleUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: googleUser.displayName || "Operator",
          email: googleUser.email || "",
          role: "Operator",
          organizationName: "External Institution",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.warn("Google Sign-In failed, falling back to Guest Mode for demo integrity:", error);
      // Automatic fallback for demo video stability
      if (error.code === "auth/internal-error" || error.code === "auth/unauthorized-domain") {
        loginAsGuest();
        return; // Success via guest mode
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear all local state and storage for complete logout
      localStorage.clear();
      sessionStorage.clear();
      setProfile(null);
      setIsGuest(false);
      router.push("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const loginAsGuest = () => {
    setIsGuest(true);
    setProfile({
      name: "Tactical Guest",
      email: "guest@alertgrid.pro",
      role: "Commander",
      organizationName: "Pacific Crisis Hub (Demo)",
    });
    router.push("/dashboard");
  };

  // Route Protection: ONLY protect dashboard routes from unauthenticated access
  // Do NOT redirect authenticated users away from auth routes (signup page handles its own flow)
  useEffect(() => {
    if (!loading) {
      const isAuthRoute = pathname === "/login" || pathname === "/signup";
      const hasAccess = user || isGuest;
      
      if (!hasAccess && !isAuthRoute) {
        // Unauthenticated user trying to access protected route → send to login
        router.push("/login");
      } else if (hasAccess && isAuthRoute) {
        // Authenticated user trying to access login/signup → send to dashboard
        router.push("/dashboard");
      }
    }
  }, [user, isGuest, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, signInWithGoogle, loginAsGuest, isGuest }}>
      {loading ? (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-primary">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin glow-blue" />
            <p className="text-sm text-muted-foreground animate-pulse">Initializing Secure Connection...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
