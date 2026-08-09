"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Stethoscope, Users } from "lucide-react";
import { registerUser } from "@/app/(site)/register/actions";
import { BUSINESS_TYPES, US_STATES, isMedSpa } from "@/lib/register-options";
import { NpiLookup, type NpiResult } from "@/components/register/NpiLookup";

type Role = "PROVIDER" | "AMBASSADOR";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  optional,
  children,
}: {
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  optional?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
        {label}
        {required ? " *" : optional ? " (optional)" : ""}
      </span>
      {children || (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      )}
    </label>
  );
}

function PasswordField({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="relative mt-2">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={8}
          placeholder={placeholder}
          className="w-full rounded-sm border border-input bg-background px-3 py-2.5 pr-10 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-primary"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}

function AddressFields({
  prefix,
  disabled,
  required,
  values,
  onChange,
}: {
  prefix: "office" | "shipping";
  disabled?: boolean;
  required?: boolean;
  values?: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  };
  onChange?: (next: {
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
}) {
  const names = {
    street1: `${prefix}Street1`,
    street2: `${prefix}Street2`,
    city: `${prefix}City`,
    state: `${prefix}State`,
    zip: `${prefix}Zip`,
  };
  const controlled = !!values && !!onChange;
  const v = values || { street1: "", street2: "", city: "", state: "", zip: "" };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Street Address 1" required={required && !disabled} placeholder="123 Main St">
          <input
            name={names.street1}
            required={required && !disabled}
            disabled={disabled}
            placeholder="123 Main St"
            value={controlled ? v.street1 : undefined}
            defaultValue={controlled ? undefined : ""}
            onChange={
              controlled
                ? (e) => onChange({ ...v, street1: e.target.value })
                : undefined
            }
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Street Address 2" optional placeholder="Suite / Unit">
          <input
            name={names.street2}
            disabled={disabled}
            placeholder="Suite / Unit"
            value={controlled ? v.street2 : undefined}
            defaultValue={controlled ? undefined : ""}
            onChange={
              controlled ? (e) => onChange({ ...v, street2: e.target.value }) : undefined
            }
            className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
          />
        </Field>
      </div>
      <Field label="City" required={required && !disabled} placeholder="City">
        <input
          name={names.city}
          required={required && !disabled}
          disabled={disabled}
          placeholder="City"
          value={controlled ? v.city : undefined}
          defaultValue={controlled ? undefined : ""}
          onChange={controlled ? (e) => onChange({ ...v, city: e.target.value }) : undefined}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
        />
      </Field>
      <Field label="State" required={required && !disabled}>
        <select
          name={names.state}
          required={required && !disabled}
          disabled={disabled}
          value={controlled ? v.state : undefined}
          defaultValue={controlled ? undefined : ""}
          onChange={controlled ? (e) => onChange({ ...v, state: e.target.value }) : undefined}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
        >
          <option value="" disabled>
            Select…
          </option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="ZIP" required={required && !disabled} placeholder="12345">
        <input
          name={names.zip}
          required={required && !disabled}
          disabled={disabled}
          placeholder="12345"
          value={controlled ? v.zip : undefined}
          defaultValue={controlled ? undefined : ""}
          onChange={controlled ? (e) => onChange({ ...v, zip: e.target.value }) : undefined}
          className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
        />
      </Field>
    </div>
  );
}

export function SignupForm({
  role,
  error,
}: {
  role: Role;
  error?: string;
}) {
  const [businessType, setBusinessType] = useState("");
  const [sameAsOffice, setSameAsOffice] = useState(true);
  const [practitionerType, setPractitionerType] = useState<"Doctor" | "Nurse">("Doctor");
  const [businessName, setBusinessName] = useState("");
  const [npi, setNpi] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [physicianNpi, setPhysicianNpi] = useState("");
  const [office, setOffice] = useState({
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
  });
  const medSpa = useMemo(() => isMedSpa(businessType), [businessType]);
  const switchRole = role === "PROVIDER" ? "AMBASSADOR" : "PROVIDER";
  const switchHref = `/register?role=${switchRole}`;

  function applyProviderNpi(r: NpiResult) {
    setNpi(r.npi);
    if (r.organizationName) setBusinessName(r.organizationName);
    else if (r.displayName && !businessName) setBusinessName(r.displayName);
    setOffice({
      street1: r.address1 || office.street1,
      street2: r.address2 || office.street2,
      city: r.city || office.city,
      state: r.state || office.state,
      zip: r.postalCode || office.zip,
    });
  }

  function applyPhysicianNpi(r: NpiResult) {
    setPhysicianNpi(r.npi);
    setPhysicianName(r.displayName || physicianName);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
            role === "PROVIDER"
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-primary/20 bg-primary/5 text-primary"
          }`}
        >
          {role === "PROVIDER" ? <Stethoscope className="size-3.5" /> : <Users className="size-3.5" />}
          Signing up as {role === "PROVIDER" ? "Provider" : "Ambassador"}
        </div>
        <h1 className="mt-5 font-display text-4xl font-semibold text-primary">Create your account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Fill in all details to create your account and submit for verification.{" "}
          <Link href={switchHref} className="font-medium text-accent hover:underline">
            Switch to {switchRole === "PROVIDER" ? "Provider" : "Ambassador"}
          </Link>
        </p>
      </div>

      <div className="mt-6 rounded-sm border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary/80">
        Add <strong>Admin@thewellnesstech.com</strong> to your contacts so verification emails are not
        filtered.
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <form action={registerUser} className="mt-10 space-y-10">
        <input type="hidden" name="role" value={role} />

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Account details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First Name" name="firstName" required placeholder="John" />
            <Field label="Last Name" name="lastName" required placeholder="Doe" />
            <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
            <Field label="Phone" name="phone" required placeholder="+1 (555) 000-0000" />
            <PasswordField
              label="Password"
              name="password"
              required
              placeholder="Min. 8 characters"
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              required
              placeholder="Repeat password"
            />
            <Field label="Referral Name" name="referralName" optional placeholder="Optional" />
            <Field
              label="Referral Email"
              name="referralEmail"
              type="email"
              optional
              placeholder="optional@example.com"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
            Business & verification details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Preferred Username" name="username" required placeholder="jdoe.clinic" />
            {role === "PROVIDER" ? (
              <Field label="Name of Practice" required placeholder="Practice / clinic name">
                <input
                  name="businessName"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Practice / clinic name"
                  className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </Field>
            ) : (
              <Field
                label="Office / Company name"
                name="companyName"
                required
                placeholder="Company name"
              />
            )}
            <div className="md:col-span-2">
              <Field label="Business Type" required>
                <select
                  name="businessType"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {role === "PROVIDER" && (
              <>
                <div className="md:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    I am a *
                  </span>
                  <div className="mt-2 flex gap-2">
                    {(["Doctor", "Nurse"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPractitionerType(t)}
                        className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                          practitionerType === t
                            ? "bg-primary text-primary-foreground"
                            : "border border-primary/20 text-primary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="practitionerType" value={practitionerType} />
                </div>

                <NpiLookup title="Find your Provider NPI" onSelect={applyProviderNpi} />

                <Field label="Provider NPI #" required placeholder="10-digit NPI">
                  <input
                    name="npi"
                    required
                    inputMode="numeric"
                    pattern="\d{10}"
                    value={npi}
                    onChange={(e) => setNpi(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit NPI"
                    className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </Field>
                <Field label="DEA Number" name="deaNumber" optional placeholder="Optional" />
                {medSpa && (
                  <>
                    <NpiLookup
                      title="Find supervising Physician NPI (MedSpa)"
                      onSelect={applyPhysicianNpi}
                    />
                    <Field label="Name of Physician" required placeholder="Supervising / medical director">
                      <input
                        name="physicianName"
                        required
                        value={physicianName}
                        onChange={(e) => setPhysicianName(e.target.value)}
                        placeholder="Supervising / medical director"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                      />
                    </Field>
                    <Field label="Physician NPI #" required placeholder="10-digit physician NPI">
                      <input
                        name="physicianNpi"
                        required
                        inputMode="numeric"
                        pattern="\d{10}"
                        value={physicianNpi}
                        onChange={(e) =>
                          setPhysicianNpi(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="10-digit physician NPI"
                        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                      />
                    </Field>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Office address</h2>
          {role === "PROVIDER" ? (
            <AddressFields prefix="office" required values={office} onChange={setOffice} />
          ) : (
            <AddressFields prefix="office" required />
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
              Shipping address (optional)
            </h2>
            <label className="flex items-center gap-2 text-sm text-primary/80">
              <input
                type="checkbox"
                name="shippingSameAsOffice"
                checked={sameAsOffice}
                onChange={(e) => setSameAsOffice(e.target.checked)}
              />
              Same as office
            </label>
          </div>
          <AddressFields prefix="shipping" disabled={sameAsOffice} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
            Business hours (optional)
          </h2>
          <textarea
            name="businessHours"
            rows={3}
            placeholder="e.g. Mon–Fri 9am–5pm"
            className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </section>

        <button
          type="submit"
          className="w-full rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft"
        >
          Create Account & Submit Verification →
        </button>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
          <p>
            Having trouble registering?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact us for help
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
