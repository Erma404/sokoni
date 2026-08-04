import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sokoni Export" },
      {
        name: "description",
        content:
          "Get in touch with the Sokoni Export trade desk — general questions, partnerships, press or anything that isn't a quote or sample request.",
      },
      { property: "og:title", content: "Contact — Sokoni Export" },
      {
        property: "og:description",
        content: "A direct line to our trade and logistics desk in Paris.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { user } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // General contact messages reuse quote_requests (no cartons/pricing, no
    // 400kg floor) — incoterm "CONTACT" flags them for the trade desk inbox,
    // the same pattern used for sample requests, without a schema change.
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim() || "—",
      email: form.email.trim(),
      incoterm: "CONTACT",
      message: `Subject: ${form.subject.trim()}\n\n${form.message.trim()}`,
      items: [{ type: "contact_message", subject: form.subject.trim() }],
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
        <p className="eyebrow">Message sent</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">Thank you</h1>
        <p className="mt-4 text-muted-foreground">
          Our trade and logistics desk in Paris will get back to you within one working day.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="eyebrow">Get in touch</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        For pricing, use{" "}
        <Link to="/rfq" className="text-clay underline underline-offset-4">
          Request a quote
        </Link>
        , and for evaluation kits use{" "}
        <Link to="/sample-request" className="text-clay underline underline-offset-4">
          Request a sample
        </Link>
        . Anything else — partnerships, press, general questions — comes straight here to our trade
        and logistics desk in Paris.
      </p>

      <form className="mt-10 space-y-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <Input
              required
              maxLength={100}
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
          </Field>
          <Field label="Company">
            <Input
              maxLength={120}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Email" required>
          <Input
            required
            type="email"
            maxLength={180}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Subject" required>
          <Input
            required
            maxLength={140}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </Field>
        <Field label="Message" required>
          <Textarea
            required
            maxLength={1000}
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Field>
        <Button type="submit" variant="clay" className="w-full" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
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
