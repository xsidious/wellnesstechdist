export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
] as const;

export const BUSINESS_TYPES = [
  "Medical Practice",
  "MedSpa",
  "Weight Loss Clinic",
  "Hormone / Functional Medicine",
  "Aesthetic Practice",
  "Telehealth",
  "Pharmacy Partner",
  "Sales / Affiliate Organization",
  "Other",
] as const;

export function isMedSpa(businessType: string | undefined | null) {
  return (businessType || "").toLowerCase().includes("medspa")
    || (businessType || "").toLowerCase().includes("med spa");
}
