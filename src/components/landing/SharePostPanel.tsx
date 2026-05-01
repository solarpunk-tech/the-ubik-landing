import { useEffect, useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  EnvelopeIcon,
  LinkedinLogoIcon,
  ShareNetworkIcon,
  WhatsappLogoIcon,
  XIcon,
  XLogoIcon
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type SharePostPanelProps = {
  title: string;
  url?: string;
};

export function SharePostPanel({ title, url = "https://theubik.com/blog" }: SharePostPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const shareText = `${title} — ${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(shareText);
    } finally {
      setCopied(true);
    }
  };

  const items = [
    { label: "Copy link", icon: copied ? CheckIcon : CopyIcon, action: copy, active: copied },
    { label: "Share on X", icon: XLogoIcon, href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}` },
    { label: "Share on WhatsApp", icon: WhatsappLogoIcon, href: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
    { label: "Share on LinkedIn", icon: LinkedinLogoIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "Share by email", icon: EnvelopeIcon, href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}` }
  ];

  if (!expanded) {
    return (
      <button type="button" className="share-callout" onClick={() => setExpanded(true)} aria-expanded="false">
        <ShareNetworkIcon aria-hidden />
        Share field note
      </button>
    );
  }

  return (
    <div className="share-panel" aria-label="Share field note">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium">Share field note</p>
        <button type="button" className="inline-flex size-7 items-center justify-center" onClick={() => setExpanded(false)} aria-label="Close share panel">
          <XIcon aria-hidden />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map(({ label, icon: Icon, href, action, active }) => {
          const className = cn("share-button", active ? "share-button-active" : "");
          if (href) {
            return (
              <a key={label} href={href} target="_blank" rel="noreferrer" className={className} aria-label={label}>
                <Icon aria-hidden />
              </a>
            );
          }

          return (
            <button key={label} type="button" onClick={action} className={className} aria-label={label}>
              <Icon aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
  );
}
