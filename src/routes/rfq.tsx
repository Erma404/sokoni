import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRfq, useSession } from "@/lib/app-context";
import { eur } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/rfq")({
  head: () => ({
    meta: [
      { title: "Request a Quote — Sokoni Export" },
      {
        name: "description",
        content:
          "Build a request for quotation on Kenyan Hass avocado lots. Trade pricing is quote-based per volume and Incoterm; our desk replies within one working day.",
      },
      { property: "og:title", content: "Request a Quote — Sokoni Export" },
      {
        property: "og:description",
        content: "Send your volumes and Incoterm — we answer with a firm offer within one working day.",
      },
    ],
  }),
  component: RfqPage,
});

function RfqPage() {
  const { items, setQty, remove, clear, estimate } = useRfq();
  const { user } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    email: user?.email ?? "",
    country: "France",
    incoterm: "DAP",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) {
      toast.error("Add at least one product to your RFQ");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      incoterm: form.incoterm,
      message: form.message.trim() || null,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        caliber: i.caliber,
        packaging: i.packaging,
        cartons: i.cartons,
      })),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    clear();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="eyebrow">RFQ received</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">Thank you</h1>
        <p className="mt-4 text-muted-foreground">
          Our trade desk will come back to you within one working day with a firm offer, shipping
          window and documentation pack.
        </p>
        <Link to="/catalog" className="mt-8 inline-block">
          <Button variant="outline">Back to catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Quote request</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">RFQ cart</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        No instant checkout — production and trade pricing are negotiated per lot. Tell us what you
        need and we answer with a firm offer.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="eyebrow mb-4">Lines</h2>
          {items.length === 0 ? (
            <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Your RFQ is empty.{" "}
              <Link to="/catalog" className="text-clay underline underline-offset-4">
                Browse the catalog
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((i) => (
                <li key={i.productId} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="stencil text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.packaging} · caliber {i.caliber} · MOQ {i.moq}
                    </div>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    value={i.cartons}
                    onChange={(e) => setQty(i.productId, Number(e.target.value))}
                    className="w-24"
                    aria-label={`Cartons of ${i.name}`}
                  />
                  <div className="w-24 text-right text-sm tabular-nums">
                    {eur(i.cartons * i.pricePerCarton)}
                  </div>
                  <button
                    onClick={() => remove(i.productId)}
                    aria-label={`Remove ${i.name}`}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && (
            <div className="mt-4 flex items-baseline justify-between">
              <span className="eyebrow">Indicative total</span>
              <span className="stencil text-xl font-medium text-clay">{eur(estimate)}</span>
            </div>
          )}
        </section>

        <section>
          <h2 className="eyebrow mb-4">Your details</h2>
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Contact name" required>
              <Input
                required
                maxLength={100}
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              />
            </Field>
            <Field label="Company" required>
              <Input
                required
                maxLength={120}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Field>
            <Field label="Email" required>
              <Input
                required
                type="email"
                maxLength={180}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country">
                <Input
                  maxLength={80}
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </Field>
              <Field label="Incoterm">
                <select
                  value={form.incoterm}
                  onChange={(e) => setForm({ ...form, incoterm: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option>DAP</option>
                  <option>DDP</option>
                  <option>FOB</option>
                </select>
              </Field>
            </div>
            <Field label="Message">
              <Textarea
                maxLength={600}
                rows={4}
                placeholder="Shipping window, packaging requirements, labelling…"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            <Button type="submit" variant="clay" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send quote request"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">
        {label}
        {required && <span className="text-clay"> *</span>}
      </Label>
      {children}
    </div>
  );
}
