import { createServerFn } from "@tanstack/react-start";

export interface DemoSeedResult {
  buyer: { email: string; password: string };
  admin: { email: string; password: string };
  orders: Array<{
    tracking_code: string;
    status: string;
    product_summary: string;
    forwarder_token: string;
  }>;
}

export const seedDemoData = createServerFn({ method: "POST" }).handler(
  async (): Promise<DemoSeedResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const BUYER = { email: "buyer.demo@sokoni-export.com", password: "SokoniDemo2026!" };
    const ADMIN = { email: "admin.demo@sokoni-export.com", password: "SokoniAdmin2026!" };

    async function ensureUser(email: string, password: string, meta: Record<string, string>) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const existing = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (existing) {
        await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
        return existing.id;
      }
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: meta,
      });
      if (error || !data.user) throw new Error(error?.message ?? "Could not create demo user");
      return data.user.id;
    }

    const buyerId = await ensureUser(BUYER.email, BUYER.password, {
      full_name: "Claire Moreau",
      company: "Primeurs de Rungis SARL",
      country: "France",
    });
    const adminId = await ensureUser(ADMIN.email, ADMIN.password, {
      full_name: "Sokoni Operations",
      company: "Sokoni Export",
      country: "Kenya",
    });

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: adminId, role: "admin" }, { onConflict: "user_id,role" });

    // Attach existing demo orders to the demo buyer
    await supabaseAdmin
      .from("orders")
      .update({ buyer_id: buyerId, buyer_company: "Primeurs de Rungis SARL" })
      .is("buyer_id", null);

    // A third order, still at the beginning of the chain
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("tracking_code", "SKN-2026-0155")
      .maybeSingle();

    if (!existing) {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          tracking_code: "SKN-2026-0155",
          buyer_id: buyerId,
          buyer_company: "Primeurs de Rungis SARL",
          product_summary: "Hass avocado · caliber 18 · 4 kg crate",
          quantity_cartons: 960,
          quantity_kg: 3840,
          incoterm: "DDP",
          origin_farm: "Kirinyaga Highlands Co-op",
          destination: "Rungis, Paris",
          status: "processing",
        })
        .select("id")
        .single();
      if (error || !order) throw new Error(error?.message ?? "Could not create demo order");

      const now = Date.now();
      const hrs = (h: number) => new Date(now - h * 3600_000).toISOString();
      await supabaseAdmin.from("tracking_events").insert([
        {
          order_id: order.id,
          checkpoint: "farm",
          stage_index: 0,
          status: "completed",
          location: "Kirinyaga, Kenya",
          occurred_at: hrs(52),
          notes: "Lot allocated to block K-12, GlobalGAP certified.",
        },
        {
          order_id: order.id,
          checkpoint: "harvested",
          stage_index: 1,
          status: "completed",
          location: "Kirinyaga, Kenya",
          occurred_at: hrs(30),
          notes: "Picked at 24.1% dry matter.",
        },
        {
          order_id: order.id,
          checkpoint: "packhouse",
          stage_index: 2,
          status: "in_progress",
          location: "Nairobi packhouse",
          occurred_at: hrs(4),
          notes: "Grading and packing in progress.",
        },
      ]);
    }

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("tracking_code,status,product_summary,forwarder_token")
      .order("created_at", { ascending: true });

    return {
      buyer: BUYER,
      admin: ADMIN,
      orders: orders ?? [],
    };
  },
);
