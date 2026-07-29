import { prisma } from "@/lib/prisma";

async function getData() {
  const gallery = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const docs = await prisma.documentation.findMany({
    orderBy: { date: "desc" },
  });
  return { gallery, docs };
}

export default async function Gallery() {
  const { gallery, docs } = await getData();

  return (
    <div className="pt-24">
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Galeri <span className="text-gold">Foto</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan momen-momen seru Nusa Badminton
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={g.imageUrl} alt={g.title || "Foto"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {g.title && <p className="text-white font-medium">{g.title}</p>}
                    {g.description && <p className="text-white/70 text-sm">{g.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted">Belum ada foto</p>
            </div>
          )}
        </div>
      </section>

      {/* Documentation List */}
      {docs.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-dark mb-4">
                Arsip <span className="text-gold">Dokumentasi</span>
              </h2>
              <p className="text-muted max-w-2xl mx-auto">
                Kumpulan dokumentasi kegiatan dan pertandingan
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {docs.map((d) => (
                <a
                  key={d.id}
                  href={d.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex flex-col items-center justify-center text-white flex-shrink-0">
                    <span className="text-lg font-bold">{new Date(d.date).getDate()}</span>
                    <span className="text-xs font-medium">{new Date(d.date).toLocaleDateString("id-ID", { month: "short" })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-navy-dark group-hover:text-gold-dark transition-colors">{d.title}</h3>
                    {d.description && <p className="text-sm text-muted line-clamp-1">{d.description}</p>}
                    <p className="text-xs text-muted mt-1">{new Date(d.date).toLocaleDateString("id-ID", { year: "numeric", day: "numeric", month: "long" })}</p>
                  </div>
                  <svg className="w-5 h-5 text-muted group-hover:text-gold transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
