import { createFileRoute } from "@tanstack/react-router";
import { PDFDocument, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

/** Header zone (in PDF points, from the top-left of the page) covered and re-stamped. */
const LOGO_BOX = { x: 42, top: 46, size: 58 };
const PAPER = rgb(243 / 255, 239 / 255, 228 / 255);
const FOREST = rgb(0.13, 0.24, 0.18);
const OCHRE = rgb(0.86, 0.67, 0.35);

const ALLOWED = /^[a-z0-9-]+\.pdf$/i;

async function getLogoDataUrl(): Promise<string | null> {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  const client = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data } = await client
    .from("brand_settings")
    .select("pdf_logo_url")
    .eq("id", "default")
    .maybeSingle();
  return (data?.pdf_logo_url as string | null) ?? null;
}

export const Route = createFileRoute("/api/public/documents/$file")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const file = params.file;
        if (!ALLOWED.test(file)) return new Response("Not found", { status: 404 });

        const origin = new URL(request.url).origin;
        const base = await fetch(`${origin}/docs/${file}`);
        if (!base.ok) return new Response("Not found", { status: 404 });
        const bytes = new Uint8Array(await base.arrayBuffer());

        const pdf = await PDFDocument.load(bytes);
        const page = pdf.getPages()[0];
        if (!page) return new Response("Invalid document", { status: 500 });
        const { height } = page.getSize();

        // Blank out the existing header mark.
        page.drawRectangle({
          x: LOGO_BOX.x - 2,
          y: height - LOGO_BOX.top - LOGO_BOX.size - 2,
          width: LOGO_BOX.size + 6,
          height: LOGO_BOX.size + 4,
          color: PAPER,
        });

        const dataUrl = await getLogoDataUrl();
        let drawn = false;
        if (dataUrl?.startsWith("data:image/")) {
          try {
            const raw = dataUrl.split(",")[1] ?? "";
            const binary = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
            const img = dataUrl.startsWith("data:image/png")
              ? await pdf.embedPng(binary)
              : await pdf.embedJpg(binary);
            const scale = Math.min(LOGO_BOX.size / img.width, LOGO_BOX.size / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            page.drawImage(img, {
              x: LOGO_BOX.x + (LOGO_BOX.size - w) / 2,
              y: height - LOGO_BOX.top - LOGO_BOX.size + (LOGO_BOX.size - h) / 2,
              width: w,
              height: h,
            });
            drawn = true;
          } catch {
            drawn = false;
          }
        }

        if (!drawn) {
          const cx = LOGO_BOX.x + LOGO_BOX.size / 2;
          const cy = height - LOGO_BOX.top - LOGO_BOX.size / 2;
          page.drawCircle({ x: cx, y: cy, size: LOGO_BOX.size / 2, color: FOREST });
          page.drawCircle({ x: cx + 6.5, y: cy, size: LOGO_BOX.size / 5.6, color: OCHRE });
        }

        const out = await pdf.save();
        return new Response(out as unknown as BodyInit, {
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `inline; filename="${file}"`,
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
