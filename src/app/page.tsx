import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HeroSlideshow from "@/components/HeroSlideshow";

async function getData() {
  const profile = await prisma.clubProfile.findFirst();
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
  const tournaments = await prisma.tournament.findMany({
    where: { status: "UPCOMING" },
    orderBy: { date: "asc" },
    take: 3,
  });
  const schedules = await prisma.schedule.findMany({
    where: { isActive: true },
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
    take: 4,
  });
  const gallery = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const contents = await prisma.content.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return { profile, banners, tournaments, schedules, gallery, contents };
}

export default async function Home() {
  const { profile, banners, tournaments, schedules, gallery, contents } = await getData();

  return (
    <div>
      <HeroSlideshow
        banners={banners}
        clubName={profile?.name || "PB. Nusa Badminton Club"}
        tagline={profile?.tagline || "Berkembang bersama, bermain dengan semangat. Jadilah bagian dari keluarga besar Nusa Badminton."}
      />

      {/* Dynamic Content */}
      {contents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-dark mb-4">
                Informasi <span className="text-gold">Lainnya</span>
              </h2>
              <p className="text-muted max-w-2xl mx-auto">
                Baca informasi dan artikel menarik seputar Nusa Badminton
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contents.map((c) => (
                <Link key={c.id} href={`/content/${c.slug}`} className="group bg-surface rounded-xl border border-gray-100 overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-200">
                  {c.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-navy-dark text-lg mb-2 group-hover:text-gold-dark transition-colors">{c.title}</h3>
                    <p className="text-sm text-muted line-clamp-3">{c.content}</p>
                    <span className="inline-block mt-3 text-sm text-gold-dark font-semibold group-hover:text-gold transition-colors">Baca selengkapnya &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-dark mb-4">
              Jadwal <span className="text-gold">Mabar</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Jadwal rutin main bareng (mabar) setiap minggunya
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {schedules.length > 0 ? schedules.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gold/30 transition-all duration-200">
                <div className="text-xs font-semibold text-gold-dark uppercase tracking-wider mb-1">{s.dayOfWeek}</div>
                <div className="text-2xl font-bold text-navy-dark mb-3">{s.time}</div>
                <h3 className="font-semibold text-navy-dark mb-1">{s.title}</h3>
                <p className="text-sm text-muted">{s.location}</p>
                {s.maxPlayers > 0 && (
                  <p className="text-xs text-muted mt-2">Max. {s.maxPlayers} pemain</p>
                )}
              </div>
            )) : (
              <div className="sm:col-span-2 lg:col-span-4 text-center py-12">
                <p className="text-muted">Belum ada jadwal mabar</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tournament Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-dark mb-4">
              Turnamen <span className="text-gold">Terdekat</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Ikuti turnamen dan pertandingan seru yang akan datang
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tournaments.length > 0 ? tournaments.map((t) => (
              <div key={t.id} className="group bg-surface rounded-2xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-bold text-lg">
                    {new Date(t.date).getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-dark">{new Date(t.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
                    <p className="text-xs text-muted">{t.time || "08:00 - Selesai"}</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-navy-dark mb-2 group-hover:text-gold-dark transition-colors">{t.title}</h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {t.location}
                </div>
              </div>
            )) : (
              <div className="md:col-span-3 text-center py-12">
                <p className="text-muted">Belum ada turnamen yang akan datang</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-dark mb-4">
                Galeri <span className="text-gold">Foto</span>
              </h2>
              <p className="text-muted max-w-2xl mx-auto">
                Momen-momen seru selama latihan dan pertandingan
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={g.imageUrl} alt={g.title || "Galeri"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">{g.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="gradient-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Gabung Bersama <span className="text-gold">Nusa Badminton</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Jadilah bagian dari keluarga besar kami. Daftar sekarang dan mulai perjalananmu!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gold text-navy-dark font-semibold rounded-xl hover:bg-gold-light transition-all duration-200 shadow-lg shadow-gold/25"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
