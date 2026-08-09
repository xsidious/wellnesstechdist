import { useServerFn } from "@tanstack/react-start";
import { trackEvent } from "./tracking.functions";

export function useTrackEvent() {
  const fn = useServerFn(trackEvent);
  return (event_name: string, source?: string, metadata?: Record<string, unknown>) => {
    // Fire-and-forget; never block UI on tracking failures.
    void fn({ data: { event_name, source, metadata } }).catch(() => {});
  };
}