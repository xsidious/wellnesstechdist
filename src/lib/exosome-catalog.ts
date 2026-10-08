export type ExosomeLine = {
  sku: string;
  name: string;
  category: string;
  size: string;
  priceCents: number;
};

export function exosomeUse(category: string) {
  return category.startsWith("Lumidor") ? "Exosome infused topical" : "Topical use";
}

/** Celexo and Lumidor lines from the Wellness Tech Distribution order form. Supplier payout is not set yet. */
export const exosomeCatalog: ExosomeLine[] = [
  { sku: "LM-01", name: "SX Rejuv Ampoule", category: "Lumidor SX", size: "6 ml x 12 ea", priceCents: 8500 },
  { sku: "LM-03", name: "SX Rejuv Toner", category: "Lumidor SX", size: "200 ml", priceCents: 3500 },
  { sku: "LM-04", name: "SX Rejuv Serum", category: "Lumidor SX", size: "50 ml", priceCents: 5000 },
  { sku: "LM-05", name: "SX Rejuv Cream", category: "Lumidor SX", size: "50 ml", priceCents: 5750 },
  { sku: "LM-09", name: "Exo Activation SX Spicule Cream", category: "Lumidor SX", size: "30 ml", priceCents: 4000 },
  { sku: "LM-02", name: "PX Solution Ampoule", category: "Lumidor PX", size: "6 ml x 12 ea", priceCents: 7000 },
  { sku: "LM-06", name: "PX Refine Toner", category: "Lumidor PX", size: "200 ml", priceCents: 2300 },
  { sku: "LM-07", name: "PX Refine Serum", category: "Lumidor PX", size: "50 ml", priceCents: 3500 },
  { sku: "LM-08", name: "PX Refine Cream", category: "Lumidor PX", size: "50 ml", priceCents: 3500 },
  { sku: "LM-14", name: "PX Bio Water Soothing Mist", category: "Lumidor PX", size: "100 ml", priceCents: 2000 },
  { sku: "LM-17", name: "PX Refine Body Cleanser", category: "Lumidor PX", size: "400 ml", priceCents: 2000 },
  { sku: "LM-10", name: "Exo Activation Cica Spicule Cream", category: "Lumidor", size: "30 ml", priceCents: 3600 },
  { sku: "LM-11", name: "Exo Activation Lacto Spicule Cream", category: "Lumidor", size: "30 ml", priceCents: 3600 },
  { sku: "LM-12", name: "Refine Shot Skinbooster 30000", category: "Lumidor", size: "3 ml", priceCents: 3000 },
  { sku: "LM-13", name: "Refine Shot Skinbooster 2000", category: "Lumidor", size: "50 ml", priceCents: 2000 },
  { sku: "LM-15", name: "Soothing Booster Cream", category: "Lumidor", size: "100 ml", priceCents: 3000 },
  { sku: "LM-16", name: "Nourishing (Lifting Exo) Cream", category: "Lumidor", size: "100 ml", priceCents: 5700 },
  { sku: "LM-18", name: "After Care Cream", category: "Lumidor", size: "10 ml", priceCents: 1500 },
  { sku: "LM-19", name: "LuciDor Galvanic Energetic Gold Mask", category: "Lumidor", size: "6 masks x 6 batteries", priceCents: 3500 },
  { sku: "SB-01", name: "Celexo BLACK LABEL Skin", category: "Celexo Skin Booster", size: "30 mg x 1 vial / 4 ml x 1 vial", priceCents: 9000 },
  { sku: "SB-01a", name: "Celexo BLACK LABEL Skin 5 Sets", category: "Celexo Skin Booster", size: "30 mg x 5 vials / 4 ml x 5 vials", priceCents: 40000 },
  { sku: "SB-02", name: "CellExosome BLACK LABEL Hair", category: "Celexo Skin Booster", size: "200 mg x 1 vial / 6 ml x 1 vial", priceCents: 8000 },
  { sku: "SB-03", name: "Celexo Hydrogel", category: "Celexo Skin Booster", size: "2 syringes", priceCents: 15000 },
  { sku: "SB-04", name: "Celexo AAPE Hair Ampoule", category: "Celexo Skin Booster", size: "200 mg x 5 vials / 6 ml x 1-5 vials", priceCents: 30000 },
  { sku: "SB-05", name: "Celexo Skin Serum", category: "Celexo Skin Booster", size: "3 ml x 10 vials", priceCents: 35000 },
  { sku: "SB-06", name: "Celexo Skin Serum", category: "Celexo Skin Booster", size: "3 ml x 2 vials", priceCents: 8000 },
  { sku: "SB-07", name: "Celexo RCM", category: "Celexo Skin Booster", size: "3 ml x 2 vials", priceCents: 8000 },
  { sku: "SB-09", name: "CellExosome BLACK LABEL After Care Cream", category: "Celexo Skin Booster", size: "50 ml", priceCents: 3500 },
  { sku: "CT-01", name: "Celexo AAPE Shampoo", category: "Celexo Professional Care", size: "500 ml", priceCents: 4000 },
  { sku: "CT-02", name: "Celexo AAPE Treatment", category: "Celexo Professional Care", size: "500 ml", priceCents: 3800 },
  { sku: "CT-03", name: "Celexo AAPE Scalp Scaler", category: "Celexo Professional Care", size: "200 ml", priceCents: 2500 },
  { sku: "CT-04", name: "Celexo AAPE Hair Tonic", category: "Celexo Professional Care", size: "100 ml", priceCents: 3500 },
  { sku: "CT-05", name: "Celexo Bio Solution Ampoule", category: "Celexo Professional Care", size: "6 ml x 5 vials / box", priceCents: 6000 },
  { sku: "CT-06", name: "Celexo Refine Shot Skin Booster 30000", category: "Celexo Professional Care", size: "3 ml x 5 vials / box", priceCents: 12500 },
  { sku: "CT-07", name: "Celexo Post Care Calming Cream", category: "Celexo Professional Care", size: "100 ml", priceCents: 4000 },
  { sku: "CT-08", name: "Celexo Post Care Recovery Cream", category: "Celexo Professional Care", size: "50 ml", priceCents: 3500 },
  { sku: "CT-09", name: "Celexo Mild Cleansing Milk", category: "Celexo Professional Care", size: "250 ml", priceCents: 3000 },
  { sku: "CT-10", name: "Celexo Enzyme Powder Wash", category: "Celexo Professional Care", size: "80 g", priceCents: 4000 },
  { sku: "CT-11", name: "Celexo Bubble Toner", category: "Celexo Professional Care", size: "300 ml", priceCents: 4000 },
  { sku: "CT-12", name: "Celexo Hydro Sealing Mask", category: "Celexo Professional Care", size: "10 masks", priceCents: 4500 },
  { sku: "CT-13", name: "Celexo Microcurrent Galvanic Mask", category: "Celexo Professional Care", size: "10 masks x 10 batteries", priceCents: 7000 },
];

export const exosomeHoldReason = "Supplier payout pricing is not set yet, so this line stays off checkout.";
