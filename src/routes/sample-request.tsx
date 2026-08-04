import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/sample-request")({
  head: () => ({
    meta: [
      { title: "Request a Sample — Sokoni Export" },
      {
        name: "description",
        content:
          "Request a Hass avocado sample kit for buyer evaluation. No minimum order — one kit per request, reviewed by our trade desk.",
      },
      { property: "og:title", content: "Request a Sample — Sokoni Export" },
      {
        property: "og:description",
        content: "One sample kit per request, no MOQ. Our team reviews every request by hand.",
      },
    ],
  }),
  component: SampleRequestPage,
});

interface ProductOption {
  id: string;
  name: string;
  caliber: string;
  packaging: string;
}

function SampleRequestPage() {
  const { user } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    email: user?.email ?? "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "France",
    notes: "",
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "sample-eligible"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,caliber,packaging")
        .neq("packaging", "Sample kit")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as ProductOption[];
    },
  });

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (productIds.length === 0) {
      toast.error("Select at least one product you'd like to sample");
      return;
    }
    setSubmitting(true);
    const selected = products.filter((p) => productIds.includes(p.id));
    // Sample requests reuse the quote_requests table (no cartons/pricing, no
    // 400kg floor) — incoterm "SAMPLE" flags them for manual review, distinct
    // from priced RFQs, without needing a schema change.
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      incoterm: "SAMPLE",
      message: [
        form.phone.trim() && `Phone: ${form.phone.trim()}`,
        `Shipping address: ${form.address_line.trim()}, ${form.city.trim()} ${form.postal_code.trim()}, ${form.country.trim()}`,
        form.notes.trim() && `Notes: ${form.notes.trim()}`,
      ]
        .filter(Boolean)
        .join("\n"),
      items: [
        {
          type: "sample_request",
          kits: 1,
          products: selected.map((p) => ({
            product_id: p.id,
            name: p.name,
            caliber: p.caliber,
            packaging: p.packaging,
          })),
        },
      ],
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="eyebrow">Sample request received</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">Thank you</h1>
        <p className="mt-4 text-muted-foreground">
          Our team reviews every sample request by hand and will come back to you shortly to confirm
          shipping details. One kit per request — no minimum order applies.
        </p>
        <Link to="/catalog" className="mt-8 inline-block">
          <Button variant="outline">Back to catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="eyebrow">Buyer evaluation</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
        Request a sample
      </h1>
      <p className="mt-4 text-muted-foreground">
        One sample kit per request, no minimum order — this is a separate flow from the priced RFQ
        cart. Tell us which lines you'd like to evaluate and our team reviews the request by hand.
      </p>

      <form className="mt-10 space-y-6" onSubmit={submit}>
        <div>
          <Label className="eyebrow">
            Product(s) of interest <span className="text-clay">*</span>
          </Label>
          <ul className="mt-3 space-y-2 border border-border p-4">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Checkbox
                  id={`product-${p.id}`}
                  checked={productIds.includes(p.id)}
                  onCheckedChange={() => toggleProduct(p.id)}
                />
                <label htmlFor={`product-${p.id}`} className="cursor-pointer text-sm">
                  {p.name} <span className="text-muted-foreground">· {p.packaging}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" required>
            <Input
              required
              type="email"
              maxLength={180}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              maxLength={40}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>

        <div>
          <Label className="eyebrow mb-1.5 block">
            Shipping address <span className="text-clay">*</span>
          </Label>
          <div className="space-y-3">
            <Input
              required
              placeholder="Street address"
              maxLength={200}
              value={form.address_line}
              onChange={(e) => setForm({ ...form, address_line: e.target.value })}
              aria-label="Street address"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                required
                placeholder="City"
                maxLength={80}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                aria-label="City"
              />
              <Input
                required
                placeholder="Postal code"
                maxLength={20}
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                aria-label="Postal code"
              />
              <Input
                required
                placeholder="Country"
                maxLength={80}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                aria-label="Country"
              />
            </div>
          </div>
        </div>

        <Field label="Notes">
          <Textarea
            maxLength={600}
            rows={3}
            placeholder="Anything our team should know before shipping the kit…"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>

        <Button type="submit" variant="clay" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Submit sample request"}
        </Button>
      </form>
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
