"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isMedSpa } from "@/lib/register-options";

const addressSchema = {
  officeStreet1: z.string().trim().min(2).max(200),
  officeStreet2: z.string().trim().max(200).optional().or(z.literal("")),
  officeCity: z.string().trim().min(2).max(100),
  officeState: z.string().trim().min(2).max(2),
  officeZip: z.string().trim().min(5).max(12),
  shippingSameAsOffice: z.boolean(),
  shippingStreet1: z.string().trim().max(200).optional().or(z.literal("")),
  shippingStreet2: z.string().trim().max(200).optional().or(z.literal("")),
  shippingCity: z.string().trim().max(100).optional().or(z.literal("")),
  shippingState: z.string().trim().max(2).optional().or(z.literal("")),
  shippingZip: z.string().trim().max(12).optional().or(z.literal("")),
};

const baseSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  referralName: z.string().trim().max(150).optional().or(z.literal("")),
  referralEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/),
  businessHours: z.string().trim().max(500).optional().or(z.literal("")),
  ...addressSchema,
});

const providerSchema = baseSchema
  .extend({
    role: z.literal("PROVIDER"),
    businessName: z.string().trim().min(2).max(200),
    businessType: z.string().trim().min(2).max(80),
    practitionerType: z.enum(["Doctor", "Nurse"]),
    npi: z.string().trim().regex(/^\d{10}$/, "NPI must be 10 digits"),
    deaNumber: z.string().trim().max(30).optional().or(z.literal("")),
    physicianName: z.string().trim().max(120).optional().or(z.literal("")),
    physicianNpi: z
      .string()
      .trim()
      .regex(/^(\d{10})?$/, "Physician NPI must be 10 digits")
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => !isMedSpa(d.businessType) || (d.physicianName && d.physicianName.length >= 2), {
    message: "Physician name required for MedSpa",
    path: ["physicianName"],
  })
  .refine((d) => !isMedSpa(d.businessType) || (d.physicianNpi && /^\d{10}$/.test(d.physicianNpi)), {
    message: "Physician NPI required for MedSpa (10 digits)",
    path: ["physicianNpi"],
  });

const ambassadorSchema = baseSchema
  .extend({
    role: z.literal("AMBASSADOR"),
    companyName: z.string().trim().min(2).max(200),
    businessType: z.string().trim().min(2).max(80),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function fail(role: string, message: string): never {
  redirect(`/register?role=${role}&error=${encodeURIComponent(message)}`);
}

function slugifyCode(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12);
  return `${base || "amb"}${Math.floor(Math.random() * 900 + 100)}`;
}

function boolFromForm(v: FormDataEntryValue | null) {
  return v === "on" || v === "true" || v === "1";
}

function commonFromForm(formData: FormData) {
  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    referralName: formData.get("referralName") || "",
    referralEmail: formData.get("referralEmail") || "",
    username: formData.get("username"),
    businessHours: formData.get("businessHours") || "",
    officeStreet1: formData.get("officeStreet1"),
    officeStreet2: formData.get("officeStreet2") || "",
    officeCity: formData.get("officeCity"),
    officeState: formData.get("officeState"),
    officeZip: formData.get("officeZip"),
    shippingSameAsOffice: boolFromForm(formData.get("shippingSameAsOffice")),
    shippingStreet1: formData.get("shippingStreet1") || "",
    shippingStreet2: formData.get("shippingStreet2") || "",
    shippingCity: formData.get("shippingCity") || "",
    shippingState: formData.get("shippingState") || "",
    shippingZip: formData.get("shippingZip") || "",
  };
}

export async function registerUser(formData: FormData) {
  const role = String(formData.get("role") || "PROVIDER").toUpperCase();

  if (role === "PROVIDER") {
    const parsed = providerSchema.safeParse({
      ...commonFromForm(formData),
      role: "PROVIDER",
      businessName: formData.get("businessName"),
      businessType: formData.get("businessType"),
      practitionerType: formData.get("practitionerType") || "Doctor",
      npi: formData.get("npi"),
      deaNumber: formData.get("deaNumber") || "",
      physicianName: formData.get("physicianName") || "",
      physicianNpi: formData.get("physicianNpi") || "",
    });
    if (!parsed.success) {
      fail("PROVIDER", parsed.error.issues[0]?.message || "Invalid registration details");
    }
    const data = parsed.data;
    await createProvider(data);
    redirect("/login?registered=1");
  }

  if (role === "AMBASSADOR") {
    const parsed = ambassadorSchema.safeParse({
      ...commonFromForm(formData),
      role: "AMBASSADOR",
      companyName: formData.get("companyName") || formData.get("businessName"),
      businessType: formData.get("businessType"),
    });
    if (!parsed.success) {
      fail("AMBASSADOR", parsed.error.issues[0]?.message || "Invalid registration details");
    }
    const data = parsed.data;
    await createAmbassador(data);
    redirect("/login?registered=1");
  }

  fail(role || "PROVIDER", "Choose Provider or Ambassador registration");
}

async function createProvider(data: z.infer<typeof providerSchema>) {
  const email = data.email.toLowerCase();
  const username = data.username.toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    fail("PROVIDER", "Email already registered");
  }
  if (await prisma.providerProfile.findUnique({ where: { username } })) {
    fail("PROVIDER", "Username already taken");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const shipping = data.shippingSameAsOffice
    ? {
        shippingStreet1: data.officeStreet1,
        shippingStreet2: data.officeStreet2 || null,
        shippingCity: data.officeCity,
        shippingState: data.officeState,
        shippingZip: data.officeZip,
      }
    : {
        shippingStreet1: data.shippingStreet1 || null,
        shippingStreet2: data.shippingStreet2 || null,
        shippingCity: data.shippingCity || null,
        shippingState: data.shippingState || null,
        shippingZip: data.shippingZip || null,
      };

  await prisma.user.create({
    data: {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email,
      passwordHash,
      role: "PROVIDER",
      providerProfile: {
        create: {
          businessName: data.businessName,
          approved: false,
          phone: data.phone,
          username,
          businessType: data.businessType,
          practitionerType: data.practitionerType,
          npi: data.npi,
          deaNumber: data.deaNumber || null,
          physicianName: isMedSpa(data.businessType) ? data.physicianName || null : null,
          physicianNpi: isMedSpa(data.businessType) ? data.physicianNpi || null : null,
          officeStreet1: data.officeStreet1,
          officeStreet2: data.officeStreet2 || null,
          officeCity: data.officeCity,
          officeState: data.officeState,
          officeZip: data.officeZip,
          shippingSameAsOffice: data.shippingSameAsOffice,
          ...shipping,
          businessHours: data.businessHours || null,
          referralName: data.referralName || null,
          referralEmail: data.referralEmail || null,
        },
      },
    },
  });
}

async function createAmbassador(data: z.infer<typeof ambassadorSchema>) {
  const email = data.email.toLowerCase();
  const username = data.username.toLowerCase();

  if (await prisma.user.findUnique({ where: { email } })) {
    fail("AMBASSADOR", "Email already registered");
  }
  if (await prisma.ambassadorProfile.findUnique({ where: { username } })) {
    fail("AMBASSADOR", "Username already taken");
  }

  let code = slugifyCode(username);
  if (await prisma.ambassadorProfile.findUnique({ where: { code } })) {
    code = slugifyCode(`${username}${Date.now().toString(36)}`);
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const shipping = data.shippingSameAsOffice
    ? {
        shippingStreet1: data.officeStreet1,
        shippingStreet2: data.officeStreet2 || null,
        shippingCity: data.officeCity,
        shippingState: data.officeState,
        shippingZip: data.officeZip,
      }
    : {
        shippingStreet1: data.shippingStreet1 || null,
        shippingStreet2: data.shippingStreet2 || null,
        shippingCity: data.shippingCity || null,
        shippingState: data.shippingState || null,
        shippingZip: data.shippingZip || null,
      };

  await prisma.user.create({
    data: {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email,
      passwordHash,
      role: "AMBASSADOR",
      ambassadorProfile: {
        create: {
          code,
          phone: data.phone,
          username,
          companyName: data.companyName,
          businessType: data.businessType,
          officeStreet1: data.officeStreet1,
          officeStreet2: data.officeStreet2 || null,
          officeCity: data.officeCity,
          officeState: data.officeState,
          officeZip: data.officeZip,
          shippingSameAsOffice: data.shippingSameAsOffice,
          ...shipping,
          businessHours: data.businessHours || null,
          referralName: data.referralName || null,
          referralEmail: data.referralEmail || null,
        },
      },
    },
  });
}
