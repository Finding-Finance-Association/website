import { create } from "zustand";

interface UIState {
  // Sidebar state by page/component
  sidebarOpen: Record<string, boolean>;
  
  // Loading states
  loadingStates: Record<string, boolean>;
  
  // Actions
  setSidebarOpen: (key: string, open: boolean) => void;
  toggleSidebar: (key: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  
  // Getters
  getSidebarOpen: (key: string, defaultValue?: boolean) => boolean;
  getLoading: (key: string) => boolean;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: {},
  loadingStates: {},

  setSidebarOpen: (key, open) =>
    set((state) => ({
      sidebarOpen: {
        ...state.sidebarOpen,
        [key]: open,
      },
    })),

  toggleSidebar: (key) =>
    set((state) => ({
      sidebarOpen: {
        ...state.sidebarOpen,
        [key]: !state.sidebarOpen[key],
      },
    })),

  setLoading: (key, loading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    })),

  // Getters
  getSidebarOpen: (key, defaultValue = true) => {
    const state = get();
    return state.sidebarOpen[key] ?? defaultValue;
  },

  getLoading: (key) => {
    const state = get();
    return state.loadingStates[key] || false;
  },
}));
