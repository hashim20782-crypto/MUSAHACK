import { useCallback, useEffect, useRef, useState } from "react";
import { backendReachable } from "@/lib/sync";

export type ConnectionState = "online" | "offline" | "syncing" | "error";

export interface Connection {
  state: ConnectionState;
  label: string;
  /** Raw browser signal; the backend may still be unreachable. */
  browserOnline: boolean;
  recheck: () => void;
  setSyncing: (syncing: boolean) => void;
  /** Demo control: force offline mode for a presentation. */
  simulatedOffline: boolean;
  setSimulatedOffline: (v: boolean) => void;
}

const LABEL: Record<ConnectionState, string> = {
  online: "Online • Synced",
  offline: "Offline",
  syncing: "Syncing…",
  error: "Connection Error",
};

const DEMO_OFFLINE_KEY = "agritrust.demo-offline";

export function useConnection(): Connection {
  const [browserOnline, setBrowserOnline] = useState(true);
  const [reachable, setReachable] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [simulatedOffline, setOffline] = useState(false);
  const probing = useRef(false);

  /* the demo offline switch survives a reload, so a presentation can move
     between screens without silently reconnecting */
  useEffect(() => {
    setOffline(window.localStorage.getItem(DEMO_OFFLINE_KEY) === "1");
  }, []);

  const setSimulatedOffline = useCallback((v: boolean) => {
    setOffline(v);
    if (v) window.localStorage.setItem(DEMO_OFFLINE_KEY, "1");
    else window.localStorage.removeItem(DEMO_OFFLINE_KEY);
  }, []);

  const probe = useCallback(async () => {
    if (probing.current) return;
    probing.current = true;
    try {
      setReachable(await backendReachable());
    } finally {
      probing.current = false;
    }
  }, []);

  useEffect(() => {
    setBrowserOnline(navigator.onLine);
    const up = () => {
      setBrowserOnline(true);
      void probe();
    };
    const down = () => setBrowserOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    void probe();
    const interval = window.setInterval(() => {
      if (navigator.onLine) void probe();
    }, 45_000);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      window.clearInterval(interval);
    };
  }, [probe]);

  let state: ConnectionState = "online";
  if (simulatedOffline || !browserOnline) state = "offline";
  else if (syncing) state = "syncing";
  else if (!reachable) state = "error";

  return {
    state,
    label: LABEL[state],
    browserOnline: browserOnline && !simulatedOffline,
    recheck: () => void probe(),
    setSyncing,
    simulatedOffline,
    setSimulatedOffline,
  };
}
