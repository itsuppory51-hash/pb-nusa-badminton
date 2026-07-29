import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await prisma.content.findUnique({ where: { slug } });

  if (!content || !content.published) notFound();

  return (
    <div className="pt-24">
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-white/60 hover:text-gold text-sm mb-4 inline-block transition-colors">&larr; Kembali ke Beranda</Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{content.title}</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.imageUrl && (
            <img src={content.imageUrl} alt={content.title} className="w-full h-64 sm:h-80 object-cover rounded-xl mb-8" />
          )}
          <div className="text-muted leading-relaxed whitespace-pre-line text-base sm:text-lg">
            {content.content}
          </div>
        </div>
      </section>
    </div>
  );
}
