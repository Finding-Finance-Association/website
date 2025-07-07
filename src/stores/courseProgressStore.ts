import { create } from "zustand";
import { persist } from "zustand/middleware";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserStore } from "./userStore";

// Helper function to get current user ID
const getCurrentUserId = () => {
  return useUserStore.getState().uid;
};

interface CourseProgressState {
  // Course progress by courseId
  completedModules: Record<string, Set<number>>;
  activeModule: Record<string, number>;
  activeTab: Record<string, "lesson" | "quiz">;
  userInputs: Record<string, Record<string, string>>;

  // Sync state
  isLoading: boolean;
  lastSyncTime: Record<string, number>;

  // Actions
  setActiveModule: (courseId: string, moduleIndex: number) => void;
  setActiveTab: (courseId: string, tab: "lesson" | "quiz") => void;
  toggleModuleCompletion: (courseId: string, moduleIndex: number) => void;
  setUserInput: (courseId: string, blockId: string, input: string) => void;
  clearCourseProgress: (courseId: string) => void;

  // Firebase sync methods
  syncToFirebase: (userId: string, courseId: string) => Promise<void>;
  loadFromFirebase: (userId: string, courseId: string) => Promise<void>;
  syncAllProgress: (userId: string) => Promise<void>;

  // Getters
  getCompletedModules: (courseId: string) => Set<number>;
  getActiveModule: (courseId: string) => number;
  getActiveTab: (courseId: string) => "lesson" | "quiz";
  getUserInput: (courseId: string, blockId: string) => string;
  getProgressPercentage: (courseId: string, totalModules: number) => number;
}

export const useCourseProgressStore = create<CourseProgressState>()(
  persist(
    (set, get) => ({
      completedModules: {},
      activeModule: {},
      activeTab: {},
      userInputs: {},
      isLoading: false,
      lastSyncTime: {},

      setActiveModule: (courseId, moduleIndex) =>
        set((state) => ({
          activeModule: {
            ...state.activeModule,
            [courseId]: moduleIndex,
          },
        })),

      setActiveTab: (courseId, tab) =>
        set((state) => ({
          activeTab: {
            ...state.activeTab,
            [courseId]: tab,
          },
        })),

      toggleModuleCompletion: (courseId, moduleIndex) => {
        set((state) => {
          const currentCompleted = state.completedModules[courseId];

          // Safely create a new Set from current data
          let newCompleted: Set<number>;
          if (currentCompleted instanceof Set) {
            newCompleted = new Set(currentCompleted);
          } else if (Array.isArray(currentCompleted)) {
            newCompleted = new Set(currentCompleted);
          } else {
            // Handle case where it's an empty object or other non-iterable
            newCompleted = new Set();
          }

          if (newCompleted.has(moduleIndex)) {
            newCompleted.delete(moduleIndex);
          } else {
            newCompleted.add(moduleIndex);
          }

          return {
            completedModules: {
              ...state.completedModules,
              [courseId]: newCompleted,
            },
          };
        });

        // Auto-sync to Firebase after a delay (debounced)
        setTimeout(() => {
          const userId = getCurrentUserId();
          if (userId) {
            get().syncToFirebase(userId, courseId);
          }
        }, 1000);
      },

      setUserInput: (courseId, blockId, input) => {
        set((state) => ({
          userInputs: {
            ...state.userInputs,
            [courseId]: {
              ...state.userInputs[courseId],
              [blockId]: input,
            },
          },
        }));

        // Auto-sync to Firebase after a delay (debounced)
        setTimeout(() => {
          const userId = getCurrentUserId();
          if (userId) {
            get().syncToFirebase(userId, courseId);
          }
        }, 2000); // Longer delay for text input
      },

      clearCourseProgress: (courseId) =>
        set((state) => {
          const newState = { ...state };
          delete newState.completedModules[courseId];
          delete newState.activeModule[courseId];
          delete newState.activeTab[courseId];
          delete newState.userInputs[courseId];
          return newState;
        }),

      // Firebase sync methods
      syncToFirebase: async (userId, courseId) => {
        if (!userId) return;

        set((state) => ({ ...state, isLoading: true }));

        try {
          const state = get();
          const progressData = {
            completedModules: Array.from(state.completedModules[courseId] || []),
            userInputs: state.userInputs[courseId] || {},
            lastUpdated: Date.now(),
          };

          const progressRef = doc(db, "users", userId, "courseProgress", courseId);
          await setDoc(progressRef, progressData, { merge: true });

          set((state) => ({
            ...state,
            lastSyncTime: { ...state.lastSyncTime, [courseId]: Date.now() },
            isLoading: false,
          }));
        } catch (error) {
          console.error("Failed to sync progress to Firebase:", error);
          set((state) => ({ ...state, isLoading: false }));
        }
      },

      loadFromFirebase: async (userId, courseId) => {
        if (!userId) return;

        set((state) => ({ ...state, isLoading: true }));

        try {
          const progressRef = doc(db, "users", userId, "courseProgress", courseId);
          const progressSnap = await getDoc(progressRef);

          if (progressSnap.exists()) {
            const data = progressSnap.data();
            set((state) => ({
              ...state,
              completedModules: {
                ...state.completedModules,
                [courseId]: new Set(data.completedModules || []),
              },
              userInputs: {
                ...state.userInputs,
                [courseId]: data.userInputs || {},
              },
              lastSyncTime: { ...state.lastSyncTime, [courseId]: data.lastUpdated || 0 },
              isLoading: false,
            }));
          } else {
            set((state) => ({ ...state, isLoading: false }));
          }
        } catch (error) {
          console.error("Failed to load progress from Firebase:", error);
          set((state) => ({ ...state, isLoading: false }));
        }
      },

      syncAllProgress: async (userId) => {
        if (!userId) return;

        const state = get();
        const courseIds = Object.keys(state.completedModules);

        for (const courseId of courseIds) {
          await get().syncToFirebase(userId, courseId);
        }
      },

      // Getters
      getCompletedModules: (courseId) => {
        const state = get();
        // console.log("Store state:", state);
        // console.log("courseId:", courseId);
        // console.log("state.completedModules:", state.completedModules);
        const completed = state.completedModules[courseId];
        // console.log("completed for courseId:", completed);

        // Handle different data types safely
        if (completed instanceof Set) {
          return completed;
        } else if (Array.isArray(completed)) {
          // Convert array to Set and update store
          const newSet = new Set<number>(completed);
          set((currentState) => ({
            ...currentState,
            completedModules: {
              ...currentState.completedModules,
              [courseId]: newSet,
            },
          }));
          return newSet;
        } else {
          // Handle case where it's undefined, null, or an object
          return new Set<number>();
        }
      },

      getActiveModule: (courseId) => {
        const state = get();
        return state.activeModule[courseId] || 0;
      },

      getActiveTab: (courseId) => {
        const state = get();
        return state.activeTab[courseId] || "lesson";
      },

      getUserInput: (courseId, blockId) => {
        const state = get();
        return state.userInputs[courseId]?.[blockId] || "";
      },

      getProgressPercentage: (courseId, totalModules) => {
        const completed = get().getCompletedModules(courseId);
        return totalModules > 0 ? Math.round((completed.size / totalModules) * 100) : 0;
      },
    }),
    {
      name: "course-progress-storage", // localStorage key
      // Only persist certain fields
      partialize: (state) => ({
        completedModules: state.completedModules,
        userInputs: state.userInputs,
      }),
    }
  )
);
