import { useEffect, useState, useSyncExternalStore } from "react";
import { axiosInstance } from "@/lib/axios";

const HEARTBEAT_INTERVAL_MS = 60 * 1000;

interface TodaySession {
  /** Time from today's sessions that have already ended (logged out). */
  completedMs: number;
  /** Start of the current open session (client clock), or null if none. */
  currentSessionStart: number | null;
}

interface PresenceState {
  online: boolean;
  session: TodaySession | null;
}

// Shared presence state so any component (e.g. the sidebar) can show it.
let state: PresenceState = { online: false, session: null };
const listeners = new Set<() => void>();

const setState = (patch: Partial<PresenceState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => state;

/** Whether this browser is currently reporting the user as online to the server. */
export const usePresenceStatus = () => useSyncExternalStore(subscribe, getSnapshot).online;

/**
 * Total time logged in today (all sessions today + the current one), in ms,
 * updating every second. Returns null until the first heartbeat succeeds.
 */
export const useTodaySessionTime = (): number | null => {
  const { session } = useSyncExternalStore(subscribe, getSnapshot);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session?.currentSessionStart) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [session?.currentSessionStart]);

  if (!session) return null;
  const running = session.currentSessionStart
    ? Math.max(0, now - session.currentSessionStart)
    : 0;
  return session.completedMs + running;
};

/**
 * Pings the backend while an admin/staff member has the dashboard open,
 * so the Settings page can show them as Online. Stops when the tab closes.
 */
export const usePresenceHeartbeat = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      setState({ online: false, session: null });
      return;
    }

    const beat = () => {
      if (!navigator.onLine) {
        setState({ online: false });
        return;
      }
      axiosInstance
        .post("/auth/heartbeat")
        .then((res) => {
          const data = res.data?.data;
          let session: TodaySession | null = state.session;
          if (data) {
            // Convert the server's session start to the client clock to avoid skew.
            const skew = data.serverNow ? Date.now() - new Date(data.serverNow).getTime() : 0;
            session = {
              completedMs: Number(data.todayCompletedMs) || 0,
              currentSessionStart: data.currentSessionStart
                ? new Date(data.currentSessionStart).getTime() + skew
                : null,
            };
          }
          setState({ online: true, session });
        })
        .catch(() => setState({ online: false }));
    };

    beat();
    const intervalId = window.setInterval(beat, HEARTBEAT_INTERVAL_MS);

    // Send one immediately when the user comes back to the tab.
    const onVisible = () => {
      if (document.visibilityState === "visible") beat();
    };
    const onOffline = () => setState({ online: false });

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", beat);
    window.addEventListener("offline", onOffline);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", beat);
      window.removeEventListener("offline", onOffline);
      setState({ online: false, session: null });
    };
  }, [enabled]);
};
