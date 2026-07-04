import Link from "next/link";
import { practitioners } from "@/lib/practitioners";

export default function BioTrigger({ slug }: { slug: string }) {
  const person = practitioners.find((p) => p.slug === slug);
  if (!person) return null;

  return (
    <Link href={`/practitioners/${slug}`} className="bio-trigger-btn">
      {person.name}
    </Link>
  );
}
