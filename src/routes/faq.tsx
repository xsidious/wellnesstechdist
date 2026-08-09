import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { ArrowUpRight, Phone, Mail, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — Wellness Tech Bio Distribution" },
      { name: "description", content: "Find answers about account setup, product catalog, ordering, training, affiliate programs and compliance for Wellness Tech Bio Distribution." },
      { property: "og:title", content: "FAQ — Wellness Tech Bio Distribution" },
      { property: "og:description", content: "Answers to common questions for practitioners and partners." },
    ],
  }),
  component: FAQ,
});

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: MessageSquare,
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Request Catalog' or 'Register Practice' on any page. Submit your medical license, DEA registration, and practice documentation. Our team verifies credentials within one business day and grants you access to pricing, COAs, and the ordering portal.",
      },
      {
        q: "Who can register and order products?",
        a: "Licensed physicians (MD, DO), nurse practitioners, physician assistants, medical spas under medical director supervision, and authorized retailers may register. All ordering accounts require active credentials and a signed compliance acknowledgment.",
      },
      {
        q: "Can consumers or patients order directly?",
        a: "No. Wellness Tech Bio Distribution serves licensed practitioners and practices only. All products require physician supervision and are not sold directly to consumers.",
      },
      {
        q: "What happens after I submit my registration?",
        a: "Our onboarding team reviews your credentials within 24 hours. Once approved, you receive a welcome email with login credentials, pricing schedule, and access to the full catalog and downloadable resources.",
      },
    ],
  },
  {
    id: "catalog",
    title: "Products & Catalog",
    icon: Phone,
    items: [
      {
        q: "What products do you offer?",
        a: "We offer 100+ compounded Rx products across GLP-1 & weight management, performance & recovery, anti-aging & longevity, hormone & sexual health, cellular energy & NAD+, and oral/sublingual categories. We also distribute high quality cosmetic grade Korean exosomes, AAPE systems, and clinical aesthetic equipment.",
      },
      {
        q: "Are your compounded products FDA approved?",
        a: "Compounded medications are not FDA-approved for the indications listed. They are prepared by verified 503A patient-specific or 503B outsourcing compounding pharmacies under physician Rx and state board oversight.",
      },
      {
        q: "Do I need a prescription to order?",
        a: "Yes. All Rx products require a valid prescription from a licensed prescriber. Some non-Rx skincare, devices, and supplies may be ordered without a prescription by verified account holders.",
      },
      {
        q: "Where can I find pricing?",
        a: "Pricing is displayed only to verified, registered practitioners after login. Request catalog access or register your practice to view wholesale pricing, MSRP, and volume discounts.",
      },
    ],
  },
  {
    id: "exosomes",
    title: "High quality Cosmetic Grade Korean Exosomes",
    icon: MessageSquare,
    items: [
      {
        q: "What are exosomes and how are they used?",
        a: "Exosomes are nano-sized extracellular vesicles containing growth factors, cytokines, and microRNAs. Our high quality cosmetic grade Korean exosomes are used topically following microchannel-creating procedures (microneedling, RF, fractional laser) to accelerate healing, improve skin density, brighten tone, and support hair restoration.",
      },
      {
        q: "Are exosomes FDA approved for injection?",
        a: "No. In the U.S., exosomes are not FDA-approved as injectables. Our exosome products are supplied for topical application only, at the discretion of a licensed medical professional, following procedures that create microchannels in the skin.",
      },
      {
        q: "What makes high quality cosmetic grade Korean exosomes different?",
        a: "South Korea is the global leader in exosomes science for aesthetics. Korean laboratories pioneered lyophilized (freeze-dried) exosomes formats, KFDA-grade cGMP manufacturing, and have the most published clinical outcomes data. Our partners use plant and stem-cell derived sources with NTA particle counting and full COA per lot.",
      },
    ],
  },
  {
    id: "ordering",
    title: "Ordering & Shipping",
    icon: Mail,
    items: [
      {
        q: "How do I place an order?",
        a: "Once verified, log in to your account, browse the catalog, add items to your cart, and submit an order request. For Rx products, attach or reference the prescription. Orders are fulfilled directly by our 503A/503B partner pharmacies.",
      },
      {
        q: "How long does shipping take?",
        a: "Most orders ship within 2-3 business days from the compounding partner facility. Overnight and cold-chain shipping are available for temperature-sensitive products. You receive tracking information once your order ships.",
      },
      {
        q: "What is your return policy?",
        a: "Due to the nature of compounded medications and medical products, all sales are final. If a product arrives damaged or incorrect, contact us within 48 hours of receipt with photos and we will coordinate a replacement directly with the compounding partner.",
      },
    ],
  },
  {
    id: "training",
    title: "Training & Education",
    icon: MessageSquare,
    items: [
      {
        q: "What training courses do you offer?",
        a: "We offer online and live training across four tracks: Icoone Roboderm®, Exosome Aesthetics, Peptide Therapeutics, and Nutrition (led by Certified Nutritionist Cherie Johnson). Courses range from foundational self-paced modules to intensive hands-on workshops.",
      },
      {
        q: "Who can enroll in training?",
        a: "Training is designed for licensed practitioners, medical spa staff, and wellness professionals. Some advanced live workshops require proof of licensure. Consumer nutrition courses are open to both practitioners and the public.",
      },
      {
        q: "How much does training cost?",
        a: "Online courses start at $299 and live workshops range from $1,619 to $3,119 depending on the track and duration. Pricing is listed on the Training page as 'Starting at' — exact tuition is confirmed at enrollment.",
      },
      {
        q: "Do you offer CE credits?",
        a: "Some courses offer continuing education credits. Check the specific course details when enrollment opens. All participants receive a certificate of completion.",
      },
    ],
  },
  {
    id: "affiliates",
    title: "Affiliate Program",
    icon: Phone,
    items: [
      {
        q: "What is the Affiliate Program?",
        a: "Our Affiliate Program enables accredited sales professionals to represent Wellness Tech Bio Distribution products to licensed practices. Affiliates earn competitive commissions, receive training, and gain access to marketing materials and exclusive territory opportunities.",
      },
      {
        q: "How do I become an affiliate?",
        a: "Apply through the Affiliates page. Submit your background, territory of interest, and professional references. Our partnership team reviews applications and schedules an interview within 3-5 business days.",
      },
      {
        q: "Do affiliates need a medical license?",
        a: "No. Affiliates are sales and territory representatives. However, they may only promote to licensed practitioners and may not prescribe, compound, or provide clinical advice.",
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & Legal",
    icon: MessageSquare,
    items: [
      {
        q: "What is 503A vs 503B compounding?",
        a: "503A pharmacies compound patient-specific prescriptions per individual Rx. 503B outsourcing facilities compound batches for healthcare facilities without patient-specific prescriptions under FDA oversight. We partner with both types depending on your practice needs.",
      },
      {
        q: "Is my practice data secure?",
        a: "Yes. We use HIPAA-compliant systems for all practice and patient-related data. Your credentials, prescriptions, and order history are encrypted and stored securely. We do not sell or share your data with third parties beyond our verified compounding partners.",
      },
      {
        q: "What compliance documentation do you provide?",
        a: "Verified accounts receive Certificates of Analysis (COA), batch records, 503A/503B partner registrations, and contraindication references. All documentation is available in the downloads section of your account portal.",
      },
    ],
  },
];

function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenItem((current) => (current === id ? null : id));
  }

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container-x py-24 md:py-32">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Support</span>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight md:text-7xl">Frequently Asked Questions.</h1>
          <p className="mt-6 max-w-2xl text-primary-foreground/90">
            Answers for practitioners, partners, and prospective accounts. Cannot find what you are looking for? Reach out and we will respond within one business day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition hover:bg-gold-soft">
              Contact us <ArrowUpRight className="size-4" />
            </Link>
            <a href="tel:8778476423" className="inline-flex items-center gap-2 rounded-sm border border-primary-foreground/50 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition hover:bg-primary-foreground/10">
              <Phone className="size-4" /> 877-847-6423
            </a>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">Categories</h3>
              <nav className="space-y-1">
                {faqCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="block rounded-sm px-3 py-2 text-sm font-medium text-primary/80 transition hover:bg-primary/5 hover:text-primary"
                  >
                    {cat.title}
                  </a>
                ))}
              </nav>
              <div className="rounded-sm border border-primary/10 bg-primary/5 p-5">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-accent">Still need help?</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our support team is available Mon–Fri, 8am–7pm ET. Clinical support is available 24/7 for active accounts.
                </p>
                <div className="mt-4 space-y-2">
                  <a href="mailto:Admin@thewellnesstech.com" className="flex items-center gap-2 text-sm text-primary hover:text-accent">
                    <Mail className="size-4" /> Admin@thewellnesstech.com
                  </a>
                  <a href="tel:8778476423" className="flex items-center gap-2 text-sm text-primary hover:text-accent">
                    <Phone className="size-4" /> 877-847-6423
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-16">
            {faqCategories.map((cat) => (
              <div key={cat.id} id={cat.id}>
                <div className="flex items-center gap-3">
                  <cat.icon className="size-5 text-accent" />
                  <h2 className="font-display text-2xl font-semibold text-primary">{cat.title}</h2>
                </div>
                <div className="mt-6 divide-y divide-primary/10">
                  {cat.items.map((item, i) => {
                    const itemId = `${cat.id}-${i}`;
                    const isOpen = openItem === itemId;
                    return (
                      <div key={itemId} className="py-5">
                        <button
                          onClick={() => toggle(itemId)}
                          className="flex w-full items-start justify-between gap-4 text-left"
                        >
                          <span className="font-display text-base font-medium text-primary">{item.q}</span>
                          <span className={`mt-1 shrink-0 text-lg text-accent transition-transform ${isOpen ? "rotate-45" : ""}`}>
                            +
                          </span>
                        </button>
                        {isOpen && (
                          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
