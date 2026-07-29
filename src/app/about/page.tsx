import { prisma } from "@/lib/prisma";

async function getData() {
  const profile = await prisma.clubProfile.findFirst();
  const aboutContent = await prisma.content.findFirst({
    where: { slug: "about" },
  });
  return { profile, aboutContent };
}

export default async function About() {
  const { profile, aboutContent } = await getData();

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Tentang <span className="text-gold">Kami</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Kenali lebih dekat PB. Nusa Badminton Club
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {profile && (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                {profile.logoUrl && (
                  <img src={profile.logoUrl} alt="Logo" className="w-20 h-20 rounded-xl object-cover" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-navy-dark">{profile.name}</h2>
                  <p className="text-gold font-medium">{profile.tagline}</p>
                </div>
              </div>
              <p className="text-muted leading-relaxed whitespace-pre-line">{profile.description}</p>
            </div>
          )}
          {aboutContent && (
            <div className="prose prose-navy max-w-none">
              <h2 className="text-2xl font-bold text-navy-dark mb-4">{aboutContent.title}</h2>
              <div className="text-muted leading-relaxed whitespace-pre-line">{aboutContent.content}</div>
            </div>
          )}
          {!profile && !aboutContent && (
            <div className="text-center py-12">
              <p className="text-muted">Konten belum tersedia. Silakan login ke admin untuk menambah konten.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
