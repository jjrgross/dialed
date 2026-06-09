import { create } from "zustand";
import { FOCUS_DURATIONS } from "@dialed/shared";

interface AppState {
  focusDurationMinutes: number;
  selectedPlanId: string | null;
  profileSection: "self" | "wheel" | "log" | "plans";
  setFocusDuration: (minutes: number) => void;
  setSelectedPlanId: (id: string | null) => void;
  setProfileSection: (section: AppState["profileSection"]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  focusDurationMinutes: FOCUS_DURATIONS[1],
  selectedPlanId: null,
  profileSection: "self",
  setFocusDuration: (minutes) => set({ focusDurationMinutes: minutes }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setProfileSection: (section) => set({ profileSection: section }),
}));
