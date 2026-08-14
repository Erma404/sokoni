import { Link, useLocation } from "@tanstack/react-router";
import { useT } from "@/lib/language";
import avocadoHandfulImg from "@/assets/avocado-handful.jpg";
import pickerWomanImg from "@/assets/picker-woman-braids.jpg";

const COPY = {
  fr: {
    tradeTitleLine1: "Parlons",
    tradeTitleLine2: "prix.",
    tradeTitleLine3: "Parlons",
    tradeTitleLine4: "arrivage.",
    tradeDeskTitle: "Trade desk Sokoni",
    tradeDeskBody:
      "Partagez votre format, volume et destination. Nous revenons avec une proposition nette : disponibilité, prix et conditions de livraison.",
    tradeCta: "Nous contacter",
  },
  en: {
    tradeTitleLine1: "Let's talk",
    tradeTitleLine2: "price.",
    tradeTitleLine3: "Let's talk",
    tradeTitleLine4: "arrival.",
    tradeDeskTitle: "Sokoni trade desk",
    tradeDeskBody:
      "Share your format, volume and destination. We'll come back with a clear proposal: availability, price and delivery terms.",
    tradeCta: "Contact us",
  },
};

/**
 * Closing contact CTA rendered on every page (see __root.tsx), just above
 * the footer — the exact same "Trade desk" block as the homepage's closing
 * section, so it reads as one consistent block instead of a different,
 * older card style.
 */
export function ContactCta() {
  const t = useT(COPY);
  const { pathname } = useLocation();

  // The homepage and the contact page each already end on this exact block.
  if (pathname === "/contact" || pathname === "/") return null;

  return (
    <section className="mb-3 mt-24 bg-background">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
        <div className="rounded-xl bg-[#eff8f0] px-[7%] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.6fr_0.85fr] lg:gap-8">
            <h2
              className="text-[56px] font-normal leading-[0.89] tracking-[-0.04em] text-[#123323] sm:text-[76px] lg:text-[6vw]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {t.tradeTitleLine1}
              <br />
              {t.tradeTitleLine2}
              <br />
              {t.tradeTitleLine3}
              <br />
              {t.tradeTitleLine4}
            </h2>

            <div className="grid gap-2.5">
              <div className="aspect-[1.4] overflow-hidden rounded-[26px_26px_26px_64px]">
                <img
                  src={avocadoHandfulImg}
                  alt="Avocats Hass Sokoni Export"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-[1.4] overflow-hidden rounded-[64px_26px_26px_26px]">
                <img
                  src={pickerWomanImg}
                  alt="Récolte d'avocats au Kenya, ferme partenaire Sokoni Export"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              <h3 className="mb-3 text-2xl font-normal tracking-[-0.02em] text-[#142b21]">
                {t.tradeDeskTitle}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-[#44554a]">{t.tradeDeskBody}</p>
              <Link
                to="/contact"
                className="inline-block rounded-full bg-[#0a4934] px-6 py-3 text-sm font-bold text-white"
              >
                {t.tradeCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
