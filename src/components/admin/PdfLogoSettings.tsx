import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 400 * 1024;

/** Admin panel to change the logo stamped on the shipment PDF documents. */
export function PdfLogoSettings() {
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void supabase
      .from("brand_settings")
      .select("pdf_logo_url")
      .eq("id", "default")
      .maybeSingle()
      .then(({ data }) => setLogo((data?.pdf_logo_url as string | null) ?? null));
  }, []);

  async function save(value: string | null) {
    setBusy(true);
    const { error } = await supabase
      .from("brand_settings")
      .update({ pdf_logo_url: value, updated_at: new Date().toISOString() })
      .eq("id", "default");
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLogo(value);
    toast.success(value ? "Logo PDF mis à jour" : "Logo PDF réinitialisé");
  }

  function onFile(file: File) {
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Format accepté : PNG ou JPG");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image trop lourde (400 Ko max)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => void save(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border bg-background overflow-hidden">
          {logo ? (
            <img src={logo} alt="Logo PDF actuel" className="size-full object-contain" />
          ) : (
            <span className="relative block size-10 rounded-full bg-primary">
              <span className="absolute right-1 top-1/2 size-4 -translate-y-1/2 rounded-full bg-ochre" />
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="text-foreground">Logo imprimé en en-tête des documents PDF</p>
          <p className="mt-1 text-xs">PNG ou JPG, carré de préférence, 400 Ko max.</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="lime" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Envoi…" : "Changer le logo"}
        </Button>
        {logo && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => void save(null)}>
            Rétablir le logo par défaut
          </Button>
        )}
      </div>
    </div>
  );
}
