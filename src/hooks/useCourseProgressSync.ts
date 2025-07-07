import { useEffect } from "react";
import { useUser } from "@/lib/useUser";
import { useCourseProgressStore } from "@/stores/courseProgressStore";

/**
 * Hook to automatically sync course progress with Firebase
 * Call this in your main layout or course pages
 */
export function useCourseProgressSync() {
  const { uid, isLoggedIn } = useUser();
  const { loadFromFirebase, syncAllProgress } = useCourseProgressStore();

  // Load progress from Firebase when user logs in
  useEffect(() => {
    if (isLoggedIn && uid) {
      // Load all existing progress from Firebase
      // This will merge with local storage data
      syncAllProgress(uid);
    }
  }, [isLoggedIn, uid, syncAllProgress]);

  // Sync to Firebase when user logs out (cleanup)
  useEffect(() => {
    return () => {
      if (uid) {
        syncAllProgress(uid);
      }
    };
  }, [uid, syncAllProgress]);

  return {
    isLoggedIn,
    uid,
  };
}

/**
 * Hook to load progress for a specific course
 * Use this in individual course pages
 */
export function useCourseProgress(courseId: string) {
  const { uid, isLoggedIn } = useUser();
  const { 
    loadFromFirebase, 
    syncToFirebase,
    getCompletedModules,
    getProgressPercentage,
    isLoading 
  } = useCourseProgressStore();

  // Load course-specific progress
  useEffect(() => {
    if (isLoggedIn && uid && courseId) {
      loadFromFirebase(uid, courseId);
    }
  }, [isLoggedIn, uid, courseId, loadFromFirebase]);

  // Manual sync function
  const syncProgress = () => {
    if (uid && courseId) {
      syncToFirebase(uid, courseId);
    }
  };

  return {
    completedModules: getCompletedModules(courseId),
    getProgressPercentage: (totalModules: number) => getProgressPercentage(courseId, totalModules),
    syncProgress,
    isLoading,
    isLoggedIn,
  };
}
