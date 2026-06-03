"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const AdminSearchContext = createContext<Ctx | null>(null);

export function AdminSearchProvider(props: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const value = useMemo(() => ({ searchQuery, setSearchQuery }), [searchQuery]);
  return <AdminSearchContext.Provider value={value}>{props.children}</AdminSearchContext.Provider>;
}

export function useAdminSearch() {
  const ctx = useContext(AdminSearchContext);
  if (!ctx) {
    throw new Error("useAdminSearch must be used within AdminSearchProvider");
  }
  return ctx;
}
