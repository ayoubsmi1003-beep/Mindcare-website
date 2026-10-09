"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { translations, Language, TranslationSchema } from "./i18n/translations";

export type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isRTL: boolean;
  t: TranslationSchema;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const listeners = new Set<() => void>();
function notifyListeners() {
  listeners.forEach((cb) => cb());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") return "fr";
  try {
    const stored = localStorage.getItem("mindcare_lang") as Language | null;
    return stored && ["fr", "en", "ar"].includes(stored) ? stored : "fr";
  } catch {
    return "fr";
  }
}

function getLanguageServerSnapshot(): Language {
  return "fr";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("mindcare_theme") as Theme | null;
    return stored && ["light", "dark"].includes(stored) ? stored : "light";
  } catch {
    return "light";
  }
}

function getThemeServerSnapshot(): Theme {
  return "light";
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getLanguageSnapshot, getLanguageServerSnapshot);
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getThemeServerSnapshot);

  useEffect(() => {
    const isRTL = language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem("mindcare_lang", lang);
    } catch {}
    notifyListeners();
  };

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem("mindcare_theme", newTheme);
    } catch {}
    notifyListeners();
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const isRTL = language === "ar";
  const t = translations[language] || translations.fr;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        isRTL,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
