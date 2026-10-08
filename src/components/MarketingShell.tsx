import Link from "next/link";
import { Logo } from "@/components/Logo";

function NavLinks() {
  return (
    <>
      <Link href="/products">Therapies</Link>
      <Link href="/exosomes">Exosomes</Link>
      <Link href="/supplies">Equipment</Link>
      <Link href="/affiliates">Affiliates</Link>
      <Link href="/compliance">503A / 503B</Link>
      <Link href="/login">Sign in</Link>
      <Link href="/signup" className="btn btn-accent nav-cta">Get practice access</Link>
    </>
  );
}

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="nav-brand" aria-label="Wellness Tech Distribution home"><Logo /></Link>
          <nav className="links links-desktop" aria-label="Main">
            <NavLinks />
          </nav>
          <details className="nav-menu">
            <summary className="nav-toggle" aria-label="Menu">
              <span className="nav-bars" aria-hidden="true"><span /><span /><span /></span>
            </summary>
            <nav className="links" aria-label="Mobile">
              <NavLinks />
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className="footer">
        <div className="wrap">
          <div className="grid-3">
            <div className="stack">
              <Logo tone="white" className="logo-footer" />
              <span>B2B resource for licensed practices. Pharmacy records stay with RxHere.</span>
              <span>Admin@thewellnesstech.com<br />877-847-6423</span>
            </div>
            <div className="stack">
              <strong style={{ color: "white" }}>Therapies</strong>
              <span>GLP-1 and weight</span>
              <span>Peptides</span>
              <span>Hormone and recovery</span>
            </div>
            <div className="stack">
              <strong style={{ color: "white" }}>Company</strong>
              <Link href="/about">About</Link>
              <Link href="/products">Shop</Link>
              <Link href="/affiliates">Affiliates</Link>
              <Link href="/compliance">503A / 503B</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div className="legal">
            <span>© 2026 Wellness Tech Distribution. For licensed practitioners only.</span>
            <span>Compounded medications are not FDA-approved. A prescription is required.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
