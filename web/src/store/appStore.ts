import { create } from "zustand";

interface WebAppState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useWebAppStore = create<WebAppState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
