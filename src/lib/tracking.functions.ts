import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { z } from "zod";

function getPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

export const trackEvent = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        event_name: z.string().min(1).max(100),
        source: z.string().min(1).max(200).optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getPublicClient();
    const { error } = await supabase.from("click_events").insert({
      event_name: data.event_name,
      event_data: { source: data.source, ...(data.metadata ?? {}) },
    });
    if (error) console.error("Track event error:", error);
    return { ok: true };
  });

export const trackPrescriberClick = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        source: z.string().min(1).max(200),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = getPublicClient();
    const { error } = await supabase.from("click_events").insert({
      event_name: "prescriber_register_click",
      event_data: { source: data.source },
    });

    if (error) {
      console.error("Click tracking error:", error);
    }

    return { ok: true };
  });
