import { redirect } from "next/navigation";
import { MarketingShell } from "@/components/MarketingShell";
import { saveNpi } from "@/lib/actions";
import { requireUser } from "@/lib/guard";
import { photos } from "@/lib/photos";

export default async function NpiPage() {
  const user = await requireUser();
  if (user.org.verificationTier >= 1 && user.credential) redirect("/portal");
  return (
    <MarketingShell>
      <section className="wrap page-banner">
        <div className="page-banner-grid">
          <div className="stack">
            <span className="kicker">Step 2 of signup</span>
            <h1>Verify with your NPI.</h1>
            <p className="lede">A registry match plus an attested license sets Tier 1. State board, DEA, and OIG vendors are not connected yet. Sandbox NPI: 1000000001.</p>
            <form className="form" action={saveNpi}>
              <label>NPI<input name="npi" inputMode="numeric" minLength={10} maxLength={10} required /></label>
              <label>State license number<input name="license" required /></label>
              <label style={{ flexDirection: "row", alignItems: "center" }}><input type="checkbox" name="attest" /> I attest this license is active.</label>
              <button className="btn btn-accent">Continue</button>
            </form>
          </div>
          <img className="banner-photo" src={photos.consult} alt="" />
        </div>
      </section>
    </MarketingShell>
  );
}
