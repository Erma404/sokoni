import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/app-context";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/track/")({
  head: () => ({
    meta: [
      { title: "Track a Shipment — Sokoni Export" },
      {
        name: "description",
        content:
          "Enter your Sokoni tracking code to follow your avocado shipment live from the Kenyan farm to Rungis, with documents attached at every checkpoint.",
      },
      { property: "og:title", content: "Track a Shipment — Sokoni Export" },
      {
        property: "og:description",
        content: "Live farm-to-Rungis tracking for every Sokoni Export order.",
      },
    ],
  }),
  component: TrackEntry,
});

function TrackEntry() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { user } = useSession();

  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <p className="eyebrow">Traceability</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
        Track my order
      </h1>
      <p className="mt-4 text-muted-foreground">
        Enter the tracking code on your order confirmation. The link works without an account —
        share it with your own team or your customer.
      </p>

      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) navigate({ to: "/track/$code", params: { code: code.trim() } });
        }}
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SKN-2026-0148"
          aria-label="Tracking code"
          className="font-mono"
        />
        <Button type="submit" variant="clay">
          Track
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-10 rule-top pt-6 text-sm text-muted-foreground">
        {user ? (
          <>
            Signed in —{" "}
            <Link to="/dashboard" className="text-clay underline underline-offset-4">
              see all your orders
            </Link>
            .
          </>
        ) : (
          <>
            Buyer with several shipments?{" "}
            <Link to="/auth" className="text-clay underline underline-offset-4">
              Sign in
            </Link>{" "}
            to see every active and past order in one dashboard.
          </>
        )}
      </div>
    </div>
  );
}
