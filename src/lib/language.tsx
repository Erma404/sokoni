import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "sokoni.lang";
// French is the site's default/SSR language; the switcher lets a visitor opt into English.
const DEFAULT_LANG: Lang = "fr";

interface LanguageState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageState>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Read the stored preference after mount only, so the first client render
  // still matches the server-rendered French markup (no hydration mismatch).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "fr") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Pick the copy object matching the current language. Usage:
 *   const t = useT({ en: { title: "Catalog" }, fr: { title: "Catalogue" } });
 *   <h1>{t.title}</h1>
 */
export function useT<T>(dict: Record<Lang, T>): T {
  const { lang } = useLanguage();
  return dict[lang];
}
