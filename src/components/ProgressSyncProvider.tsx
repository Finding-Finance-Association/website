"use client";

import { ReactNode } from "react";
import { useCourseProgressSync } from "@/hooks/useCourseProgressSync";

interface ProgressSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider component that handles automatic syncing of course progress
 * Place this high in your component tree (like in layout.tsx)
 */
export function ProgressSyncProvider({ children }: ProgressSyncProviderProps) {
  // This hook will automatically sync progress when user logs in/out
  useCourseProgressSync();
  
  return <>{children}</>;
}
