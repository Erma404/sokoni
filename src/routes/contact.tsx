import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import contactImg from "@/assets/farm-manager-portrait.jpg";
import contactImg2 from "@/assets/picker-woman-braids.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sokoni Export" },
      {
        name: "description",
        content:
          "Contactez le bureau commercial de Sokoni Export — questions générales, partenariats, presse, ou tout ce qui n'est ni un devis ni une demande d'échantillon.",
      },
      { property: "og:title", content: "Contact — Sokoni Export" },
      {
        property: "og:description",
        content: "Une ligne directe vers notre bureau commercial et logistique à Paris.",
      },
    ],
  }),
  component: ContactPage,
});

const COPY = {
  fr: {
    sent: "Message envoyé",
    thankYou: "Merci",
    thankYouBody:
      "Notre bureau commercial et logistique à Paris revient vers vous sous un jour ouvré.",
    backHome: "Retour à l'accueil",
    getInTouch: "Nous contacter",
    title: "Contact",
    introPre: "Pour la tarification, utilisez",
    requestQuote: "Demander un devis",
    introMid: ", et pour les kits d'évaluation utilisez",
    requestSample: "Demander un échantillon",
    introPost:
      ". Tout le reste — partenariats, presse, questions générales — arrive directement ici, à notre bureau commercial et logistique à Paris.",
    name: "Nom",
    company: "Entreprise",
    email: "Email",
    subject: "Sujet",
    message: "Message",
    sending: "Envoi…",
    send: "Envoyer le message",
  },
  en: {
    sent: "Message sent",
    thankYou: "Thank you",
    thankYouBody:
      "Our trade and logistics desk in Paris will get back to you within one working day.",
    backHome: "Back to home",
    getInTouch: "Get in touch",
    title: "Contact",
    introPre: "For pricing, use",
    requestQuote: "Request a quote",
    introMid: ", and for evaluation kits use",
    requestSample: "Request a sample",
    introPost:
      ". Anything else — partnerships, press, general questions — comes straight here to our trade and logistics desk in Paris.",
    name: "Name",
    company: "Company",
    email: "Email",
    subject: "Subject",
    message: "Message",
    sending: "Sending…",
    send: "Send message",
  },
};

function ContactPage() {
  const { user } = useSession();
  const t = useT(COPY);
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
        <p className="eyebrow">{t.sent}</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">{t.thankYou}</h1>
        <p className="mt-4 text-muted-foreground">{t.thankYouBody}</p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="outline">{t.backHome}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header — matches the homepage's "Trade desk" block exactly: pale-green
          canvas, giant title, two organically-rounded photos, intro copy. */}
      <section className="mb-3 bg-background">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
          <div className="rounded-xl bg-[#eff8f0] px-[7%] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.6fr_0.85fr] lg:gap-8">
              <div>
                <p className="eyebrow">{t.getInTouch}</p>
                <h1
                  className="mt-3 text-[42px] font-normal leading-[0.95] tracking-[-0.03em] text-[#123323] sm:text-[64px]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {t.title}
                </h1>
              </div>

              <div className="grid gap-2.5">
                <div className="aspect-[1.4] overflow-hidden rounded-[26px_26px_26px_64px]">
                  <img
                    src={contactImg}
                    alt="Responsable ferme partenaire Sokoni Export, Murang'a, Kenya"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center 25%" }}
                  />
                </div>
                <div className="aspect-[1.4] overflow-hidden rounded-[64px_26px_26px_26px]">
                  <img
                    src={contactImg2}
                    alt="Récolte d'avocats au Kenya, ferme partenaire Sokoni Export"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                <p className="text-sm leading-relaxed text-[#44554a]">
                  {t.introPre}{" "}
                  <Link to="/rfq" className="font-semibold text-[#0a4934] underline underline-offset-4">
                    {t.requestQuote}
                  </Link>
                  {t.introMid}{" "}
                  <Link
                    to="/sample-request"
                    className="font-semibold text-[#0a4934] underline underline-offset-4"
                  >
                    {t.requestSample}
                  </Link>
                  {t.introPost}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <form className="mx-auto max-w-2xl space-y-4 px-5 pb-14" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.name} required>
            <Input
              required
              maxLength={100}
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
          </Field>
          <Field label={t.company}>
            <Input
              maxLength={120}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </Field>
        </div>
        <Field label={t.email} required>
          <Input
            required
            type="email"
            maxLength={180}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label={t.subject} required>
          <Input
            required
            maxLength={140}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </Field>
        <Field label={t.message} required>
          <Textarea
            required
            maxLength={1000}
            rows={6}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Field>
        <Button type="submit" variant="cta" className="w-full" disabled={submitting}>
          {submitting ? t.sending : t.send}
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
