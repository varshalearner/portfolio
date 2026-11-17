"use client";

import { useEffect } from "react";

/** Drops one-time flags like ?saved=1 from the address bar, so a reload does not repeat the notice. */
export function ClearSearchParams() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.hash);
    }
  }, []);
  return null;
}
