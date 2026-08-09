export type Product = {
  sku: string;
  name: string;
  spec: string;
  price: number;
  msrp: number;
  info: string;
};

export type Group = { title: string; blurb: string; items: Product[] };

export const catalog: Group[] = [
  {
    title: "SX Series — Stem Rejuvenation",
    blurb:
      "Human-derived exosomes. A 5-step stem-cell rejuvenation regimen designed to brighten, firm and restore elasticity in mature or photo-aged skin.",
    items: [
      {
        sku: "SX-01",
        name: "SX STEM Solution Ampoules",
        spec: "6 ml × 12 vials",
        price: 85,
        msrp: 170,
        info: "Concentrated stem-cell conditioned media ampoules used in-clinic post-microneedling, RF or laser to accelerate recovery and boost collagen signaling.",
      },
      {
        sku: "SX-02",
        name: "SX Rejuv Toner",
        spec: "200 ml",
        price: 30,
        msrp: 60,
        info: "Hydrating prep toner that balances skin pH and primes the barrier to absorb the SX serum and cream.",
      },
      {
        sku: "SX-03",
        name: "SX Rejuv Serum",
        spec: "50 ml",
        price: 50,
        msrp: 100,
        info: "Lightweight stem-cell extract serum targeting fine lines, dullness and uneven tone for at-home daily use.",
      },
      {
        sku: "SX-04",
        name: "SX Rejuv Cream",
        spec: "50 ml",
        price: 57.5,
        msrp: 115,
        info: "Rich moisturizer that seals in actives, supports the lipid barrier and improves overnight skin density.",
      },
    ],
  },
  {
    title: "PX Series — Refine & Restore",
    blurb:
      "Plant-derived exosomes. A six-product refining system for daily aesthetic protocols — pore refinement, oil balance and gentle calming.",
    items: [
      {
        sku: "PX-01",
        name: "PX Solution Ampoules",
        spec: "6 ml × 12 vials",
        price: 70,
        msrp: 140,
        info: "In-clinic ampoules with refining peptides — pairs with microneedling for pore size, texture and post-acne marks.",
      },
      {
        sku: "PX-02",
        name: "PX Refine Toner",
        spec: "200 ml",
        price: 23,
        msrp: 46,
        info: "Mild astringent toner that tightens pores and removes residual impurities after cleansing.",
      },
      {
        sku: "PX-03",
        name: "PX Refine Serum",
        spec: "50 ml",
        price: 35,
        msrp: 70,
        info: "Pore-refining serum with niacinamide-style actives to balance sebum and even tone.",
      },
      {
        sku: "PX-04",
        name: "PX Refine Cream",
        spec: "50 ml",
        price: 35,
        msrp: 70,
        info: "Non-comedogenic moisturizer for combination and oily skin types — lightweight, hydrating, matte finish.",
      },
      {
        sku: "PX-05",
        name: "PX BIO Water Soothing MIST",
        spec: "100 ml",
        price: 24,
        msrp: 48,
        info: "Calming bio-water mist used to soothe reactive skin during or after in-clinic treatments.",
      },
    ],
  },
  {
    title: "Spicule Series — Microchannel Activation",
    blurb:
      "Botanical spicules create micro-channels in the stratum corneum, allowing actives to penetrate without needles.",
    items: [
      {
        sku: "SP-01",
        name: "Refine SHOT SKIN BOOSTER 30000",
        spec: "3 ml",
        price: 30,
        msrp: 60,
        info: "High-density spicule shot for in-clinic exfoliation and skin renewal — strong turnover, single-session results.",
      },
      {
        sku: "SP-02",
        name: "Refine SHOT SKIN BOOSTER 2000",
        spec: "50 ml",
        price: 20,
        msrp: 40,
        info: "Lower-density maintenance spicule formula for facials and gentler skin renewal protocols.",
      },
      {
        sku: "SP-03",
        name: "EXO Activation SX Spicule Cream",
        spec: "30 ml",
        price: 40,
        msrp: 80,
        info: "Spicule + exosome activation cream for rejuvenation protocols — drives SX actives deeper into the dermis.",
      },
      {
        sku: "SP-04",
        name: "EXO Activation CICA Spicule Cream",
        spec: "30 ml",
        price: 36,
        msrp: 72,
        info: "Centella-based calming spicule cream for sensitized, post-procedure or rosacea-prone skin.",
      },
      {
        sku: "SP-05",
        name: "EXO Activation LACTO Spicule Cream",
        spec: "30 ml",
        price: 36,
        msrp: 72,
        info: "Lactobacillus-fermented spicule cream for barrier repair and microbiome support.",
      },
    ],
  },
  {
    title: "Creams",
    blurb: "Post-procedure, lifting and recovery creams featuring exosome technology.",
    items: [
      {
        sku: "CR-01",
        name: "Soothing BOOSTER Cream",
        spec: "100 ml",
        price: 30,
        msrp: 60,
        info: "Calming, anti-inflammatory cream used immediately post-treatment to reduce erythema and discomfort.",
      },
      {
        sku: "CR-02",
        name: "Lifting EXO Cream",
        spec: "100 ml",
        price: 57,
        msrp: 114,
        info: "Exosome-enriched firming cream that improves elasticity, jawline definition and skin density with daily use.",
      },
      {
        sku: "CR-03",
        name: "CellExosome After Care Cream",
        spec: "50 ml",
        price: 25,
        msrp: 50,
        info: "Take-home recovery cream for patients following microneedling, peels, RF or laser — promotes barrier recovery.",
      },
    ],
  },
  {
    title: "Cleansers",
    blurb: "Gentle prep cleansers used to start every facial or device-based protocol.",
    items: [
      {
        sku: "CL-01",
        name: "PX Refine Cleansing GEL",
        spec: "250 ml",
        price: 20,
        msrp: 45,
        info: "Sulfate-free gel cleanser for face — removes makeup, sebum and impurities without stripping the barrier.",
      },
      {
        sku: "CL-02",
        name: "PX Refine BODY Cleanser",
        spec: "400 ml",
        price: 20,
        msrp: 45,
        info: "Body cleanser formulated for sensitive and post-procedure body skin (booty, back, décolleté treatments).",
      },
    ],
  },
  {
    title: "Hair",
    blurb: "AAPE and exosome scalp & hair restoration line for trichology and aesthetic medicine.",
    items: [
      {
        sku: "HR-01",
        name: "Celexo AAPE Hair Scaler",
        spec: "200 ml",
        price: 30,
        msrp: 60,
        info: "Scalp scaler that exfoliates buildup and prepares the scalp for AAPE and exosome treatments.",
      },
      {
        sku: "HR-02",
        name: "SX Rejuv EXO Shampoo",
        spec: "500 ml",
        price: 38,
        msrp: 76,
        info: "Daily exosome shampoo supporting follicle health and a balanced scalp microbiome.",
      },
      {
        sku: "HR-03",
        name: "EXO STEM Hair TONIC",
        spec: "100 ml",
        price: 30,
        msrp: 60,
        info: "Leave-on stem-cell tonic for thinning hair — used between in-clinic treatments to extend results.",
      },
      {
        sku: "HR-04",
        name: "SX Rejuv EXO Treatment",
        spec: "500 ml",
        price: 38,
        msrp: 76,
        info: "Weekly exosome masque that strengthens the hair shaft and improves density over time.",
      },
    ],
  },
  {
    title: "Skin Booster — Professional",
    blurb: "Lyophilized exosome and AAPE skin and hair boosters for in-clinic professional use only.",
    items: [
      {
        sku: "SB-01",
        name: "Celexo Black Label Skin",
        spec: "Powder 30 mg + Solvent 4 ml",
        price: 90,
        msrp: 180,
        info: "Premium lyophilized exosome skin booster — flagship formula for anti-aging, glow and post-laser recovery.",
      },
      {
        sku: "SB-02",
        name: "Black Label Hair",
        spec: "Powder 30 mg + Solvent 4 ml",
        price: 80,
        msrp: 160,
        info: "Premium exosome hair booster for androgenic alopecia, post-PRP combination protocols and hair density.",
      },
      {
        sku: "SB-03",
        name: "Celexo S",
        spec: "Powder 200 mg + Solvent 6 ml",
        price: 70,
        msrp: 140,
        info: "High-volume exosome booster designed for larger treatment areas — neck, décolleté, hands and body.",
      },
      {
        sku: "SB-04",
        name: "Celexo HG",
        spec: "2 Syringes",
        price: 150,
        msrp: 300,
        info: "Pre-mixed syringe format of the HG booster — ready to use, ideal for fast in-clinic protocols.",
      },
      {
        sku: "SB-05",
        name: "Celexo (10 vial)",
        spec: "3 ml × 10 vials",
        price: 350,
        msrp: 700,
        info: "Multi-patient pack — 10-vial value pack of the core Celexo exosome booster for high-volume clinics.",
      },
      {
        sku: "SB-06",
        name: "Celexo (2 vial)",
        spec: "3 ml × 2 vials",
        price: 80,
        msrp: 160,
        info: "Trial / single-patient pack of the Celexo exosome booster.",
      },
      {
        sku: "SB-07",
        name: "AAPE Skin",
        spec: "Powder 290 mg + Solvent 6 ml (6 sets)",
        price: 300,
        msrp: 600,
        info: "Six-set pack of AAPE (Advanced Adipose-derived stem cell Protein Extract) for skin rejuvenation programs.",
      },
      {
        sku: "SB-08",
        name: "AAPE Hair",
        spec: "Powder 290 mg + Solvent 6 ml (6 sets)",
        price: 300,
        msrp: 600,
        info: "Six-set pack of AAPE for scalp and hair restoration treatment series.",
      },
    ],
  },
  {
    title: "Mask",
    blurb: "In-clinic energizing treatment mask.",
    items: [
      {
        sku: "MK-01",
        name: "Energetic Galvanic Gold Mask",
        spec: "6 Masks + 6 Batteries",
        price: 50,
        msrp: 100,
        info: "Self-powered galvanic gold mask that drives serums deeper, brightens and visibly lifts — perfect treatment finisher.",
      },
    ],
  },
];

export const allItems: Product[] = catalog.flatMap((g) => g.items);
