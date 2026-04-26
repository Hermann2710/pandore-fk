"use client";
import { useEffect, useState } from "react";

// Prevents hydration mismatches for components that read from localStorage.
// Returns false on the server and during the first client render,
// then true once the client has fully hydrated.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated;
}
