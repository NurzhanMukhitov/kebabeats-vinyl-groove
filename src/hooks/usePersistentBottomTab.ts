import { useCallback, useState } from "react";
import type { BottomTab } from "@/components/BottomNav";

const STORAGE_KEY = "kebabeats-active-tab";

function readTab(): BottomTab {
  if (typeof window === "undefined") return "mixes";
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === "mixes" || v === "crew" || v === "radio") return v;
  } catch {
    /* private mode etc. */
  }
  return "mixes";
}

function writeTab(tab: BottomTab) {
  try {
    sessionStorage.setItem(STORAGE_KEY, tab);
  } catch {
    /* ignore */
  }
}

/**
 * Restores Mixes / Crew / Radio after refresh (session tab).
 */
export function usePersistentBottomTab() {
  const [activeTab, setActiveTabState] = useState<BottomTab>(() => readTab());

  const setActiveTab = useCallback((tab: BottomTab) => {
    setActiveTabState(tab);
    writeTab(tab);
  }, []);

  return { activeTab, setActiveTab };
}
