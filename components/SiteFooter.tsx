import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 px-3 pb-3">
      <div className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-[0_24px_60px_rgba(15,40,60,0.18)]">
        <div className="container-x grid gap-12 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="inline-block size-2 rounded-full bg-accent" />
              WELLNESS TECH BIO DISTRIBUTION
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/85">
              A trusted B2B resource for 503A & 503B pharmaceutical-grade peptide therapies and GLP-1
              products — connecting licensed physicians and accredited sales affiliates with verified
              compounding partners.
            </p>
            <p className="mt-4 text-xs text-primary-foreground/75">
              Admin@thewellnesstech.com · 877-847-6423
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-full border border-primary-foreground/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/90 transition hover:bg-primary-foreground/10"
            >
              Partner login
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Quality Assured
            </h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/cgmp-badge.png"
              alt="cGMP Certified badge"
              className="mt-4 h-28 w-auto object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Compounded Therapies
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
              <li>GLP-1 & Weight Management</li>
              <li>Performance & Recovery</li>
              <li>Anti-Aging & Longevity</li>
              <li>Hormone & Sexual Health</li>
              <li>Cellular Energy & NAD+</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
              <li>
                <Link href="/about" className="hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/supplies" className="hover:text-accent">
                  Supplies
                </Link>
              </li>
              <li>
                <Link href="/register?role=PROVIDER" className="hover:text-accent">
                  Become a Prescriber
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="hover:text-accent">
                  Affiliates
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-accent">
                  503A / 503B
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20">
          <div className="container-x flex flex-col gap-2 py-5 text-xs text-primary-foreground/75 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} Wellness Tech Bio Distribution. For licensed practitioners
              only.
            </p>
            <p>
              Compounded medications are not FDA-approved for the indications listed. Physician Rx
              required.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
