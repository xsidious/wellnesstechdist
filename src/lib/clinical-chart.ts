export type ClinicalSignature = {
  label: string;
  kind: string;
  value: string;
  signedAt?: string | null;
  printedName?: string | null;
};

export type ClinicalChartPackage = {
  version?: number;
  source?: string;
  syncedAt?: string;
  order?: Record<string, unknown>;
  patient?: {
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    address?: Record<string, unknown> | null;
  } | null;
  intake?: {
    id?: string;
    reference?: string | null;
    status?: string | null;
    statusNote?: string | null;
    programs?: string[];
    referredBy?: string | null;
    createdAt?: string | null;
    payload?: Record<string, unknown> | null;
  } | null;
  therapy?: Record<string, unknown> | null;
  prescriptionLines?: unknown[];
  signatures?: ClinicalSignature[];
};

export function parseJsonSafe<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function flattenPayloadEntries(payload: Record<string, unknown> | null | undefined, max = 80) {
  if (!payload) return [] as Array<{ key: string; value: string }>;
  const rows: Array<{ key: string; value: string }> = [];

  const walk = (obj: unknown, prefix: string) => {
    if (rows.length >= max) return;
    if (obj == null) return;
    if (typeof obj !== "object") {
      rows.push({ key: prefix || "value", value: String(obj) });
      return;
    }
    if (Array.isArray(obj)) {
      const compact =
        obj.length <= 12 && obj.every((v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
          ? obj.map(String).join(", ")
          : JSON.stringify(obj);
      rows.push({ key: prefix || "list", value: compact });
      return;
    }
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (rows.length >= max) break;
      const path = prefix ? `${prefix}.${key}` : key;
      // Skip huge signature blobs in the flat table — shown in signatures section.
      if (/signature|dataUrl|data_url/i.test(key) && typeof value === "string" && value.length > 120) {
        rows.push({ key: path, value: "[signature on file]" });
        continue;
      }
      if (value && typeof value === "object") walk(value, path);
      else rows.push({ key: path, value: value == null ? "" : String(value) });
    }
  };

  walk(payload, "");
  return rows;
}
