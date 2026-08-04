import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FORWARDER_STAGE_KEYS, stageIndex } from "@/lib/checkpoints";

const tokenSchema = z.object({ token: z.string().uuid() });

export const getForwarderShipment = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, tracking_code, product_summary, quantity_cartons, quantity_kg, incoterm, origin_farm, destination, status",
      )
      .eq("forwarder_token", data.token)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!order) return { order: null, events: [] };

    const { data: events, error: eventsError } = await supabaseAdmin
      .from("tracking_events")
      .select("*")
      .eq("order_id", order.id)
      .order("stage_index", { ascending: true });
    if (eventsError) throw new Error(eventsError.message);

    return { order, events: events ?? [] };
  });

const eventSchema = z.object({
  token: z.string().uuid(),
  checkpoint: z.string().refine((v) => FORWARDER_STAGE_KEYS.includes(v), "Checkpoint not allowed"),
  occurred_at: z.string().min(1),
  location: z.string().max(160).optional().nullable(),
  reference: z.string().max(120).optional().nullable(),
  notes: z.string().max(600).optional().nullable(),
  document_url: z.string().url().max(600).optional().nullable().or(z.literal("")),
  document_label: z.string().max(120).optional().nullable(),
});

export const logForwarderCheckpoint = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => eventSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("forwarder_token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) throw new Error("Invalid access link");

    const index = stageIndex(data.checkpoint);

    const { error: insertError } = await supabaseAdmin.from("tracking_events").insert({
      order_id: order.id,
      checkpoint: data.checkpoint,
      stage_index: index,
      status: "completed",
      occurred_at: new Date(data.occurred_at).toISOString(),
      location: data.location || null,
      reference: data.reference || null,
      notes: data.notes || null,
      document_url: data.document_url || null,
      document_label: data.document_label || null,
    });
    if (insertError) throw new Error(insertError.message);

    const nextStatus =
      data.checkpoint === "arrival_rungis" || data.checkpoint === "in_transit"
        ? "in_transit"
        : undefined;
    if (nextStatus) {
      await supabaseAdmin
        .from("orders")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id);
    }

    return { ok: true };
  });
