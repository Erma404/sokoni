import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { seedDemoData, type DemoSeedResult } from "@/lib/demo.functions";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/checkpoints";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo access — Sokoni Export" },
      {
        name: "description",
        content:
          "Demo accounts and tracking codes to explore the Sokoni Export buyer dashboard, admin back-office and forwarder portal.",
      },
      { property: "og:title", content: "Demo access — Sokoni Export" },
      {
        property: "og:description",
        content: "Test accounts, tracking codes and forwarder links for Sokoni Export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        toast.success(`${label} copié`);
      }}
      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-primary/50"
    >
      <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="block font-mono text-sm text-foreground">{value}</span>
    </button>
  );
}

function Demo() {
  const seed = useServerFn(seedDemoData);
  const [data, setData] = useState<DemoSeedResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      setData(await seed());
      toast.success("Données de démo prêtes");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec du seed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 md:py-20">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Sandbox</p>
      <h1 className="stencil mt-3 text-4xl font-medium md:text-5xl">Accès démo</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Génère des comptes et des expéditions de démonstration pour tester les trois
        environnements : espace acheteur, back-office Sokoni et portail transitaire.
      </p>

      <Button className="mt-6" onClick={run} disabled={loading}>
        {loading ? "Génération…" : data ? "Régénérer les données démo" : "Générer les données démo"}
      </Button>

      {data && (
        <div className="mt-10 space-y-10">
          <section>
            <h2 className="stencil text-2xl font-medium">Comptes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-5">
                <p className="text-sm font-medium">Acheteur — /dashboard</p>
                <Field label="Email" value={data.buyer.email} />
                <Field label="Mot de passe" value={data.buyer.password} />
                <Link to="/auth" className="inline-block text-sm underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
              <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-5">
                <p className="text-sm font-medium">Admin Sokoni — /admin</p>
                <Field label="Email" value={data.admin.email} />
                <Field label="Mot de passe" value={data.admin.password} />
                <Link to="/auth" className="inline-block text-sm underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="stencil text-2xl font-medium">Expéditions de démo</h2>
            <div className="mt-4 space-y-4">
              {data.orders.map((o) => (
                <div key={o.tracking_code} className="rounded-2xl border border-border bg-card/60 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-sm">{o.tracking_code}</p>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{o.product_summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <Link
                      to="/track/$code"
                      params={{ code: o.tracking_code }}
                      className="underline underline-offset-4"
                    >
                      Suivi public
                    </Link>
                    <Link
                      to="/forwarder/$token"
                      params={{ token: o.forwarder_token }}
                      className="underline underline-offset-4"
                    >
                      Portail transitaire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
