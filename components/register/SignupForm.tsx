"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Stethoscope,
  Users,
} from "lucide-react";
import { registerUser } from "@/app/(site)/register/actions";
import { BUSINESS_TYPES, US_STATES, isMedSpa } from "@/lib/register-options";
import { NpiLookup, type NpiResult } from "@/components/register/NpiLookup";

type Role = "PROVIDER" | "AMBASSADOR";

type Address = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralName: string;
  referralEmail: string;
  username: string;
  businessName: string;
  companyName: string;
  businessType: string;
  practitionerType: "Doctor" | "Nurse";
  npi: string;
  deaNumber: string;
  physicianName: string;
  physicianNpi: string;
  office: Address;
  shipping: Address;
  sameAsOffice: boolean;
  businessHours: string;
};

const emptyAddress = (): Address => ({
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
});

const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/40 disabled:opacity-50";

function Field({
  label,
  required,
  optional,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
        {label}
        {required ? " *" : optional ? " (optional)" : ""}
      </span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  required,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label} required={required} error={error}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          required={required}
          minLength={8}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-10`}
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
    </Field>
  );
}

function AddressFields({
  values,
  onChange,
  disabled,
  required,
}: {
  values: Address;
  onChange: (next: Address) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <Field label="Street Address 1" required={required && !disabled}>
          <input
            disabled={disabled}
            value={values.street1}
            onChange={(e) => onChange({ ...values, street1: e.target.value })}
            placeholder="123 Main St"
            className={inputClass}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Street Address 2" optional>
          <input
            disabled={disabled}
            value={values.street2}
            onChange={(e) => onChange({ ...values, street2: e.target.value })}
            placeholder="Suite / Unit"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="City" required={required && !disabled}>
        <input
          disabled={disabled}
          value={values.city}
          onChange={(e) => onChange({ ...values, city: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="State" required={required && !disabled}>
        <select
          disabled={disabled}
          value={values.state}
          onChange={(e) => onChange({ ...values, state: e.target.value })}
          className={inputClass}
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
      <Field label="ZIP" required={required && !disabled}>
        <input
          disabled={disabled}
          value={values.zip}
          onChange={(e) => onChange({ ...values, zip: e.target.value })}
          placeholder="12345"
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function providerSteps(medSpa: boolean) {
  return [
    { id: "account", label: "Account" },
    { id: "practice", label: "Practice" },
    { id: "credentials", label: medSpa ? "Credentials" : "NPI" },
    { id: "address", label: "Address" },
    { id: "review", label: "Review" },
  ] as const;
}

const ambassadorSteps = [
  { id: "account", label: "Account" },
  { id: "business", label: "Business" },
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
] as const;

export function SignupForm({
  role,
  error,
  embedded = false,
}: {
  role: Role;
  error?: string;
  embedded?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralName: "",
    referralEmail: "",
    username: "",
    businessName: "",
    companyName: "",
    businessType: "",
    practitionerType: "Doctor",
    npi: "",
    deaNumber: "",
    physicianName: "",
    physicianNpi: "",
    office: emptyAddress(),
    shipping: emptyAddress(),
    sameAsOffice: true,
    businessHours: "",
  });

  const medSpa = useMemo(() => isMedSpa(form.businessType), [form.businessType]);
  const steps = role === "PROVIDER" ? providerSteps(medSpa) : ambassadorSteps;
  const switchRole = role === "PROVIDER" ? "AMBASSADOR" : "PROVIDER";
  const progress = ((step + 1) / steps.length) * 100;

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function applyProviderNpi(r: NpiResult) {
    setForm((f) => ({
      ...f,
      npi: r.npi,
      businessName: r.organizationName || r.displayName || f.businessName,
      office: {
        street1: r.address1 || f.office.street1,
        street2: r.address2 || f.office.street2,
        city: r.city || f.office.city,
        state: r.state || f.office.state,
        zip: r.postalCode || f.office.zip,
      },
    }));
  }

  function applyPhysicianNpi(r: NpiResult) {
    setForm((f) => ({
      ...f,
      physicianNpi: r.npi,
      physicianName: r.displayName || f.physicianName,
    }));
  }

  function validateStep(): string | null {
    const id = steps[step].id;
    if (id === "account") {
      if (!form.firstName.trim() || !form.lastName.trim()) return "Enter your first and last name.";
      if (!form.email.trim() || !form.email.includes("@")) return "Enter a valid email.";
      if (form.phone.trim().length < 7) return "Enter a valid phone number.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    if (id === "practice" || id === "business") {
      if (!/^[a-zA-Z0-9._-]{3,40}$/.test(form.username)) {
        return "Username must be 3–40 characters (letters, numbers, . _ -).";
      }
      if (role === "PROVIDER" && form.businessName.trim().length < 2) {
        return "Enter your practice name.";
      }
      if (role === "AMBASSADOR" && form.companyName.trim().length < 2) {
        return "Enter your company name.";
      }
      if (!form.businessType) return "Select a business type.";
    }
    if (id === "credentials") {
      if (!/^\d{10}$/.test(form.npi)) return "Provider NPI must be 10 digits.";
      if (medSpa) {
        if (form.physicianName.trim().length < 2) return "Physician name is required for MedSpa.";
        if (!/^\d{10}$/.test(form.physicianNpi)) return "Physician NPI must be 10 digits.";
      }
    }
    if (id === "address") {
      if (
        !form.office.street1.trim() ||
        !form.office.city.trim() ||
        !form.office.state ||
        form.office.zip.trim().length < 5
      ) {
        return "Complete the office address.";
      }
      if (!form.sameAsOffice) {
        if (
          !form.shipping.street1.trim() ||
          !form.shipping.city.trim() ||
          !form.shipping.state ||
          form.shipping.zip.trim().length < 5
        ) {
          return "Complete the shipping address, or mark it same as office.";
        }
      }
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  const stepId = steps[step].id;

  return (
    <div className={`mx-auto w-full ${embedded ? "max-w-3xl" : "max-w-3xl"}`}>
      {!embedded && (
        <div className="mb-6 text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              role === "PROVIDER"
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-primary/20 bg-primary/5 text-primary"
            }`}
          >
            {role === "PROVIDER" ? (
              <Stethoscope className="size-3.5" />
            ) : (
              <Users className="size-3.5" />
            )}
            {role === "PROVIDER" ? "Provider registration" : "Ambassador registration"}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Step {step + 1} of {steps.length} ·{" "}
            <Link href={`/register?role=${switchRole}`} className="font-medium text-accent hover:underline">
              Switch to {switchRole === "PROVIDER" ? "Provider" : "Ambassador"}
            </Link>
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-[0_20px_50px_rgba(15,40,60,0.08)]">
        <div className="border-b border-primary/10 bg-primary/[0.03] px-5 py-4 md:px-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {steps[step].label}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="mt-4 flex flex-wrap gap-2">
            {steps.map((s, i) => (
              <li
                key={s.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  i < step
                    ? "bg-accent/20 text-accent-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/5 text-primary/45"
                }`}
              >
                {i < step ? <Check className="size-3" /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-5 md:px-7 md:py-6">
          <div className="mb-4 rounded-2xl border border-primary/10 bg-primary/[0.03] px-3.5 py-2.5 text-xs text-primary/80">
            Add <strong>Admin@thewellnesstech.com</strong> to contacts so verification email is not filtered.
          </div>

          {(error || stepError) && (
            <p className="mb-4 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {stepError || error}
            </p>
          )}

          <form action={registerUser} className="space-y-5">
            <input type="hidden" name="role" value={role} />
            {/* Persist all values across steps via controlled hidden/visible fields */}
            <input type="hidden" name="firstName" value={form.firstName} />
            <input type="hidden" name="lastName" value={form.lastName} />
            <input type="hidden" name="email" value={form.email} />
            <input type="hidden" name="phone" value={form.phone} />
            <input type="hidden" name="password" value={form.password} />
            <input type="hidden" name="confirmPassword" value={form.confirmPassword} />
            <input type="hidden" name="referralName" value={form.referralName} />
            <input type="hidden" name="referralEmail" value={form.referralEmail} />
            <input type="hidden" name="username" value={form.username} />
            <input type="hidden" name="businessName" value={form.businessName} />
            <input type="hidden" name="companyName" value={form.companyName} />
            <input type="hidden" name="businessType" value={form.businessType} />
            <input type="hidden" name="practitionerType" value={form.practitionerType} />
            <input type="hidden" name="npi" value={form.npi} />
            <input type="hidden" name="deaNumber" value={form.deaNumber} />
            <input type="hidden" name="physicianName" value={form.physicianName} />
            <input type="hidden" name="physicianNpi" value={form.physicianNpi} />
            <input type="hidden" name="businessHours" value={form.businessHours} />
            {form.sameAsOffice && <input type="hidden" name="shippingSameAsOffice" value="on" />}
            <input type="hidden" name="officeStreet1" value={form.office.street1} />
            <input type="hidden" name="officeStreet2" value={form.office.street2} />
            <input type="hidden" name="officeCity" value={form.office.city} />
            <input type="hidden" name="officeState" value={form.office.state} />
            <input type="hidden" name="officeZip" value={form.office.zip} />
            <input
              type="hidden"
              name="shippingStreet1"
              value={form.sameAsOffice ? form.office.street1 : form.shipping.street1}
            />
            <input
              type="hidden"
              name="shippingStreet2"
              value={form.sameAsOffice ? form.office.street2 : form.shipping.street2}
            />
            <input
              type="hidden"
              name="shippingCity"
              value={form.sameAsOffice ? form.office.city : form.shipping.city}
            />
            <input
              type="hidden"
              name="shippingState"
              value={form.sameAsOffice ? form.office.state : form.shipping.state}
            />
            <input
              type="hidden"
              name="shippingZip"
              value={form.sameAsOffice ? form.office.zip : form.shipping.zip}
            />

            {stepId === "account" && (
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="First Name" required>
                  <input
                    value={form.firstName}
                    onChange={(e) => patch("firstName", e.target.value)}
                    className={inputClass}
                    placeholder="John"
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    value={form.lastName}
                    onChange={(e) => patch("lastName", e.target.value)}
                    className={inputClass}
                    placeholder="Doe"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => patch("email", e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
                <PasswordField
                  label="Password"
                  required
                  value={form.password}
                  onChange={(v) => patch("password", v)}
                  placeholder="Min. 8 characters"
                />
                <PasswordField
                  label="Confirm Password"
                  required
                  value={form.confirmPassword}
                  onChange={(v) => patch("confirmPassword", v)}
                  placeholder="Repeat password"
                />
                <Field label="Referral Name" optional>
                  <input
                    value={form.referralName}
                    onChange={(e) => patch("referralName", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Referral Email" optional>
                  <input
                    type="email"
                    value={form.referralEmail}
                    onChange={(e) => patch("referralEmail", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {(stepId === "practice" || stepId === "business") && (
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Preferred Username" required>
                  <input
                    value={form.username}
                    onChange={(e) => patch("username", e.target.value)}
                    className={inputClass}
                    placeholder="jdoe.clinic"
                  />
                </Field>
                {role === "PROVIDER" ? (
                  <Field label="Name of Practice" required>
                    <input
                      value={form.businessName}
                      onChange={(e) => patch("businessName", e.target.value)}
                      className={inputClass}
                      placeholder="Practice / clinic name"
                    />
                  </Field>
                ) : (
                  <Field label="Office / Company name" required>
                    <input
                      value={form.companyName}
                      onChange={(e) => patch("companyName", e.target.value)}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </Field>
                )}
                <div className="md:col-span-2">
                  <Field label="Business Type" required>
                    <select
                      value={form.businessType}
                      onChange={(e) => patch("businessType", e.target.value)}
                      className={inputClass}
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
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                      I am a *
                    </span>
                    <div className="mt-1.5 flex gap-2">
                      {(["Doctor", "Nurse"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => patch("practitionerType", t)}
                          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                            form.practitionerType === t
                              ? "bg-primary text-primary-foreground"
                              : "border border-primary/15 text-primary hover:border-primary/30"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {stepId === "credentials" && (
              <div className="space-y-4">
                <NpiLookup title="Find your Provider NPI" onSelect={applyProviderNpi} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Provider NPI #" required>
                    <input
                      inputMode="numeric"
                      value={form.npi}
                      onChange={(e) =>
                        patch("npi", e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className={inputClass}
                      placeholder="10-digit NPI"
                    />
                  </Field>
                  <Field label="DEA Number" optional>
                    <input
                      value={form.deaNumber}
                      onChange={(e) => patch("deaNumber", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
                {medSpa && (
                  <div className="space-y-3 rounded-2xl border border-accent/25 bg-accent/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                      MedSpa supervising physician
                    </p>
                    <NpiLookup
                      title="Find supervising Physician NPI"
                      onSelect={applyPhysicianNpi}
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Name of Physician" required>
                        <input
                          value={form.physicianName}
                          onChange={(e) => patch("physicianName", e.target.value)}
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Physician NPI #" required>
                        <input
                          inputMode="numeric"
                          value={form.physicianNpi}
                          onChange={(e) =>
                            patch("physicianNpi", e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stepId === "address" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                    Office address
                  </h3>
                  <div className="mt-3">
                    <AddressFields
                      required
                      values={form.office}
                      onChange={(office) => patch("office", office)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">
                      Shipping address
                    </h3>
                    <label className="flex items-center gap-2 text-sm text-primary/80">
                      <input
                        type="checkbox"
                        checked={form.sameAsOffice}
                        onChange={(e) => patch("sameAsOffice", e.target.checked)}
                      />
                      Same as office
                    </label>
                  </div>
                  <div className="mt-3">
                    <AddressFields
                      disabled={form.sameAsOffice}
                      required={!form.sameAsOffice}
                      values={form.sameAsOffice ? form.office : form.shipping}
                      onChange={(shipping) => patch("shipping", shipping)}
                    />
                  </div>
                </div>
                <Field label="Business hours" optional>
                  <textarea
                    rows={3}
                    value={form.businessHours}
                    onChange={(e) => patch("businessHours", e.target.value)}
                    placeholder="e.g. Mon–Fri 9am–5pm"
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {stepId === "review" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReviewCard title="Account">
                    <p>
                      {form.firstName} {form.lastName}
                    </p>
                    <p>{form.email}</p>
                    <p>{form.phone}</p>
                  </ReviewCard>
                  <ReviewCard title={role === "PROVIDER" ? "Practice" : "Business"}>
                    <p>@{form.username}</p>
                    <p>{role === "PROVIDER" ? form.businessName : form.companyName}</p>
                    <p>{form.businessType}</p>
                    {role === "PROVIDER" && <p>{form.practitionerType}</p>}
                  </ReviewCard>
                  {role === "PROVIDER" && (
                    <ReviewCard title="Credentials">
                      <p>NPI {form.npi}</p>
                      {form.deaNumber && <p>DEA {form.deaNumber}</p>}
                      {medSpa && (
                        <p>
                          Physician {form.physicianName} · {form.physicianNpi}
                        </p>
                      )}
                    </ReviewCard>
                  )}
                  <ReviewCard title="Office">
                    <p>{form.office.street1}</p>
                    {form.office.street2 && <p>{form.office.street2}</p>}
                    <p>
                      {form.office.city}, {form.office.state} {form.office.zip}
                    </p>
                  </ReviewCard>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitting creates your account and sends it for verification. You can sign in while
                  approval is pending.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-5">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition hover:border-primary/30 disabled:opacity-40"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground shadow-[0_10px_24px_rgba(20,70,100,0.18)] transition hover:bg-primary/90"
                >
                  Continue <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-foreground shadow-[0_10px_24px_rgba(180,140,40,0.22)] transition hover:bg-gold-soft"
                >
                  Create account & submit <Check className="size-3.5" />
                </button>
              )}
            </div>
          </form>

          <div className="mt-5 space-y-1 text-center text-sm text-muted-foreground">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
            <p>
              Need help?{" "}
              <Link href="/contact" className="text-accent hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-4 text-sm text-primary/90">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">{title}</p>
      <div className="mt-2 space-y-0.5 leading-relaxed">{children}</div>
    </div>
  );
}
