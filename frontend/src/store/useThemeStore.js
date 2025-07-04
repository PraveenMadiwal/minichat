// src/store/useThemeStore.js
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "retro",
  setTheme: (newTheme) => {
    localStorage.setItem("chat-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Important!
    set({ theme: newTheme });
  },
}));
