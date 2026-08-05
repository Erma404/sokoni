import { statusLabel } from "@/lib/checkpoints";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const { lang } = useLanguage();
  return (
    <span
      className={cn(
        "stencil inline-flex items-center px-3 py-1 text-[0.7rem] font-medium",
        status === "delivered" && "bg-primary text-primary-foreground",
        status === "in_transit" && "bg-clay text-clay-foreground",
        status !== "delivered" &&
          status !== "in_transit" &&
          "bg-secondary text-secondary-foreground",
      )}
    >
      {statusLabel(status, lang)}
    </span>
  );
}
