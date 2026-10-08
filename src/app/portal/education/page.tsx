import Link from "next/link";
import { requireUser } from "@/lib/guard";
import { photos } from "@/lib/photos";
import { prisma } from "@/lib/prisma";

const covers: Record<string, string> = {
  "peptide-catalog": photos.peptides,
  "wellness-protocols": photos.consult,
  contraindications: photos.weight,
  "weight-protocol": photos.weight,
};

export default async function EducationPage() {
  const user = await requireUser();
  const items = await prisma.contentItem.findMany({ orderBy: { title: "asc" } });
  return (
    <>
      <h1>Education</h1>
      <div className="grid-2">
        {items.map((item) => {
          const locked = user.org.verificationTier < item.accessTier && !user.roles.includes("admin");
          return (
            <article className="card" key={item.id}>
              <img className="card-photo" src={covers[item.slug] || photos.consult} alt="" />
              <span className="kicker">{item.type}</span>
              <b>{item.title}</b>
              {locked ? <span>Unlocks at Tier {item.accessTier}.</span> : <Link href={`/portal/education/${item.slug}`}>Open</Link>}
            </article>
          );
        })}
      </div>
    </>
  );
}
