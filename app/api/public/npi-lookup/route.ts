import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const NPPES_URL = "https://npiregistry.cms.hhs.gov/api/";

const querySchema = z.object({
  number: z.string().regex(/^\d{10}$/).optional(),
  first_name: z.string().trim().min(2).max(80).optional(),
  last_name: z.string().trim().min(2).max(80).optional(),
  organization_name: z.string().trim().min(2).max(120).optional(),
  city: z.string().trim().min(2).max(80).optional(),
  state: z.string().trim().length(2).optional(),
  postal_code: z.string().trim().min(2).max(12).optional(),
  taxonomy_description: z.string().trim().min(2).max(120).optional(),
  enumeration_type: z.enum(["NPI-1", "NPI-2"]).optional(),
  limit: z.coerce.number().int().min(1).max(25).optional().default(10),
});

type NppesResult = {
  number?: string;
  enumeration_type?: string;
  basic?: Record<string, string>;
  addresses?: Array<Record<string, string>>;
  taxonomies?: Array<{ desc?: string; primary?: boolean; code?: string }>;
};

function mapResult(r: NppesResult) {
  const basic = r.basic || {};
  const location =
    r.addresses?.find((a) => a.address_purpose === "LOCATION") ||
    r.addresses?.[0] ||
    {};
  const taxonomy =
    r.taxonomies?.find((t) => t.primary)?.desc || r.taxonomies?.[0]?.desc || "";

  const isOrg = r.enumeration_type === "NPI-2";
  const displayName = isOrg
    ? basic.organization_name || "Organization"
    : [basic.first_name, basic.middle_name, basic.last_name, basic.credential]
        .filter(Boolean)
        .join(" ");

  return {
    npi: String(r.number || ""),
    enumerationType: r.enumeration_type || "",
    displayName,
    firstName: basic.first_name || "",
    lastName: basic.last_name || "",
    organizationName: basic.organization_name || "",
    credential: basic.credential || "",
    status: basic.status || "",
    taxonomy,
    phone: location.telephone_number || "",
    address1: location.address_1 || "",
    address2: location.address_2 || "",
    city: location.city || "",
    state: location.state || "",
    postalCode: (location.postal_code || "").slice(0, 5),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = Object.fromEntries(searchParams.entries());
  const parsed = querySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide an NPI number or at least two search fields (e.g. name + state)." },
      { status: 400 },
    );
  }

  const q = parsed.data;
  if (
    !q.number &&
    !q.first_name &&
    !q.last_name &&
    !q.organization_name &&
    !q.taxonomy_description
  ) {
    return NextResponse.json(
      { error: "Search by NPI number, name, or organization." },
      { status: 400 },
    );
  }

  // CMS requires another field when state/city alone are used.
  if ((q.state || q.city || q.postal_code) && !q.number && !q.first_name && !q.last_name && !q.organization_name) {
    return NextResponse.json(
      { error: "Add a name or organization when searching by location." },
      { status: 400 },
    );
  }

  const params = new URLSearchParams({ version: "2.1", limit: String(q.limit) });
  if (q.number) params.set("number", q.number);
  if (q.first_name) params.set("first_name", q.first_name.endsWith("*") ? q.first_name : `${q.first_name}*`);
  if (q.last_name) params.set("last_name", q.last_name.endsWith("*") ? q.last_name : `${q.last_name}*`);
  if (q.organization_name) {
    params.set(
      "organization_name",
      q.organization_name.endsWith("*") ? q.organization_name : `${q.organization_name}*`,
    );
  }
  if (q.city) params.set("city", q.city);
  if (q.state) params.set("state", q.state.toUpperCase());
  if (q.postal_code) params.set("postal_code", q.postal_code);
  if (q.taxonomy_description) params.set("taxonomy_description", q.taxonomy_description);
  if (q.enumeration_type) params.set("enumeration_type", q.enumeration_type);

  try {
    const res = await fetch(`${NPPES_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "NPI Registry is temporarily unavailable. Try again shortly." },
        { status: 502 },
      );
    }
    const data = (await res.json()) as {
      result_count?: number;
      results?: NppesResult[];
      Errors?: Array<{ description?: string }>;
    };

    if (data.Errors?.length) {
      return NextResponse.json(
        { error: data.Errors[0]?.description || "NPI search failed" },
        { status: 400 },
      );
    }

    const results = (data.results || []).map(mapResult);
    return NextResponse.json({
      count: data.result_count ?? results.length,
      results,
      source: "https://npiregistry.cms.hhs.gov/",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the CMS NPI Registry." },
      { status: 502 },
    );
  }
}
