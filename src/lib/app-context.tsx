import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SessionState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const SessionContext = createContext<SessionState>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, isAdmin, loading }),
    [session, isAdmin, loading],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}

/* ---------------- RFQ cart ---------------- */

export interface RfqItem {
  productId: string;
  name: string;
  caliber: string;
  packaging: string;
  pricePerCarton: number;
  moq: number;
  cartons: number;
}

interface RfqState {
  items: RfqItem[];
  add: (item: Omit<RfqItem, "cartons">, cartons?: number) => void;
  setQty: (productId: string, cartons: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  estimate: number;
}

const RfqContext = createContext<RfqState | null>(null);
const STORAGE_KEY = "sokoni.rfq";

export function RfqProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RfqItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as RfqItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((item: Omit<RfqItem, "cartons">, cartons?: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, cartons: i.cartons + (cartons ?? item.moq) } : i,
        );
      }
      return [...prev, { ...item, cartons: cartons ?? item.moq }];
    });
  }, []);

  const setQty = useCallback((productId: string, cartons: number) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, cartons: Math.max(1, cartons) } : i)),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<RfqState>(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((n, i) => n + i.cartons, 0),
      estimate: items.reduce((n, i) => n + i.cartons * i.pricePerCarton, 0),
    }),
    [items, add, setQty, remove, clear],
  );

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq() {
  const ctx = useContext(RfqContext);
  if (!ctx) throw new Error("useRfq must be used inside RfqProvider");
  return ctx;
}
