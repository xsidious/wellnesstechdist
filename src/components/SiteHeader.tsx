import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTrackEvent } from "@/lib/useTrackEvent";

const nav = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Compounded Therapies" },
  { to: "/exosomes", label: "Exosomes" },
  { to: "/training", label: "Training" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

function PrescriberLink({ className }: { className?: string }) {
  return (
    <a
      href="https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Become a Prescriber
    </a>
  );
}

function AffiliateLink({ className }: { className?: string }) {
  return (
    <Link to="/affiliates" className={className}>
      Become an Affiliate
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const track = useTrackEvent();
  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/images/wellness-tech-logo.jpeg" alt="Wellness Tech Distribution logo" className="h-10 object-contain" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-primary/70 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: n.to === "/" }}
              onClick={n.to === "/products" ? () => track("catalog_nav_click", "header_desktop") : undefined}
            >
              {n.label}
            </Link>
          ))}
          <PrescriberLink className="text-sm font-medium text-accent transition-colors hover:text-accent/80" />
          <AffiliateLink className="text-sm font-medium text-accent transition-colors hover:text-accent/80" />
          <Link
            to="/contact"
            className="rounded-sm bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition hover:bg-primary/90"
            onClick={() => track("request_catalog_click", "header_desktop")}
          >
            Request Catalog
          </Link>
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-primary/10 md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => {
                  if (n.to === "/products") track("catalog_nav_click", "header_mobile");
                  setOpen(false);
                }}
                className="rounded-sm px-3 py-2 text-sm font-medium text-primary/80 hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-2 text-sm font-medium text-accent hover:bg-secondary"
            >
              Become a Prescriber
            </a>
            <Link
              to="/affiliates"
              onClick={() => setOpen(false)}
              className="rounded-sm px-3 py-2 text-sm font-medium text-accent hover:bg-secondary"
            >
              Become an Affiliate
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}