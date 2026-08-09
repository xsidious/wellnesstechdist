import { useCallback } from "react";

/**
 * Lightweight client tracking stub — fire-and-forget console log.
 * Replace with a server action / analytics SDK when ready.
 */
export function useTrackEvent() {
  return useCallback(
    (event_name: string, source?: string, metadata?: Record<string, unknown>) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("[track]", event_name, source ?? "", metadata ?? {});
      }
    },
    [],
  );
}
