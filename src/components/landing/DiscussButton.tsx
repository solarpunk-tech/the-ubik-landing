import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/posthog";
import { cn } from "@/lib/utils";

/**
 * The one commercial next step. Every "discuss" CTA goes to /demo, which says
 * what the session covers before handing off to the calendar, so a buyer never
 * lands on a bare booking page (or the app) without knowing what they booked.
 */
export function DiscussButton({ location, label, className }: { location: string; label?: string; className?: string }) {
  const { t } = useTranslation();
  return (
    <Button asChild size="lg" className={cn("home-primary-action", className)}>
      <Link to="/demo" onClick={() => trackEvent("cta_clicked", { cta: "discuss_workflow", location })}>
        {label ?? t("cta.discuss")} <ArrowRightIcon aria-hidden />
      </Link>
    </Button>
  );
}
