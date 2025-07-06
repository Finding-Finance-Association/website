"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/stores/userStore";
import { useMemo } from "react";

type UserData = {
  uid: string;
  email: string;
  username: string;
  enrolledCourseIds: string[];
};

type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  const setUserStore = useUserStore((state) => state.setUser);
  const clearUserStore = useUserStore((state) => state.clearUser);
  const uid = useUserStore((state) => state.uid);
  const email = useUserStore((state) => state.email);
  const username = useUserStore((state) => state.username);
  const enrolledCourseIds = useUserStore((state) => state.enrolledCourseIds);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserStore({
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              username: data.username || firebaseUser.displayName || "User",
              enrolledCourseIds: data.enrolledCourseIds || [],
            });
          } else {
            clearUserStore();
          }
          setLoading(false);
        });
      } else {
        clearUserStore();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [setUserStore, clearUserStore]);

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully!");
    clearUserStore();
  };

  const value = useMemo(
    () => ({
      user: uid && email && username
        ? {
            uid,
            email,
            username,
            enrolledCourseIds,
          }
        : null,
      loading,
      logout,
    }),
    [uid, email, username, enrolledCourseIds, loading, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
