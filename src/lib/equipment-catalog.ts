export const equipmentHoldReason = "Equipment price is not set yet, so this line stays off checkout.";

/** Celexo PRO from the 8-page ABio materials brochure. No selling price is printed there. */
export const equipmentCatalog = [
  {
    sku: "CELEXO-PRO",
    name: "Celexo PRO",
    category: "Aesthetic equipment",
    form: "4-in-1 platform",
    size: "Main unit, cart, and four handpieces. 15 kg",
    description:
      "4-in-1 platform from ABio materials. Handpieces: ultrasonic peeling at 25 kHz (cleansing, absorption, and lifting modes), LIPUS low-intensity pulsed ultrasound (dermis 1/3/10 MHz, epidermis 10/17 MHz), SLM rubbing handpiece with a 3.0 mm tip, and cryo-thermal (thermal 30–45°C, cooling −10–10°C). KC-certified beauty device, not a medical device. It provides no medical efficacy or effect beyond cosmetic purposes.",
  },
] as const;
