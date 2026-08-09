import { Link } from "@tanstack/react-router";
import { useTrackEvent } from "@/lib/useTrackEvent";

export function SiteFooter() {
  const track = useTrackEvent();
  return (
    <footer className="mt-32 bg-primary text-primary-foreground">
      <div className="container-x grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="inline-block size-2 rounded-full bg-accent" />
            WELLNESS TECH BIO DISTRIBUTION
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/85">
            A trusted resource for 503A & 503B pharmaceutical-grade peptide therapies and GLP-1 products — connecting licensed physicians and accredited sales affiliates with verified compounding partners.
          </p>
          <p className="mt-4 text-xs text-primary-foreground/75">
            Admin@thewellnesstech.com · 877-847-6423
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Quality Assured</h4>
          <img
            src="/images/cgmp-badge.png"
            alt="cGMP Certified badge"
            className="mt-4 h-28 w-auto object-contain"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Compounded Therapies</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
            <li>GLP-1 & Weight Management</li>
            <li>Performance & Recovery</li>
            <li>Anti-Aging & Longevity</li>
            <li>Hormone & Sexual Health</li>
            <li>Cellular Energy & NAD+</li>
            <li>Oral & Sublingual</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
            <li><Link to="/products" onClick={() => track("catalog_nav_click", "footer_products")}>Products</Link></li>
            <li><Link to="/affiliates">Affiliates</Link></li>
            <li><a href="https://www.prescribeusa.com/register?role=provider&ref=cmp4iqnah00ci10n0xxewcr9x" target="_blank" rel="noopener noreferrer" className="text-accent">Become a Prescriber</a></li>
            <li><Link to="/compliance">503A / 503B</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/25">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-primary-foreground/75 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Wellness Tech Bio Distribution. For licensed practitioners only.</p>
          <p>Compounded medications are not FDA-approved for the indications listed. Physician Rx required.</p>
        </div>
      </div>
    </footer>
  );
}