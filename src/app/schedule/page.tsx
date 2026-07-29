import { prisma } from "@/lib/prisma";

async function getData() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { date: "asc" },
  });
  const schedules = await prisma.schedule.findMany({
    where: { isActive: true },
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
  });
  return { tournaments, schedules };
}

export default async function Schedule() {
  const { tournaments, schedules } = await getData();

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Jadwal <span className="text-gold">Kegiatan</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Turnamen dan jadwal main bareng Nusa Badminton
          </p>
        </div>
      </section>

      {/* Tournaments */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-dark mb-8">
            Turnamen
          </h2>
          <div className="space-y-4">
            {tournaments.length > 0 ? tournaments.map((t) => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all duration-200">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold">{new Date(t.date).getDate()}</span>
                  <span className="text-xs font-medium">{new Date(t.date).toLocaleDateString("id-ID", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-navy-dark">{t.title}</h3>
                  <p className="text-sm text-muted line-clamp-1">{t.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t.time || "08:00"}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {t.location}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === "UPCOMING" ? "bg-blue-50 text-blue-600" :
                      t.status === "ONGOING" ? "bg-green-50 text-green-600" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {t.status === "UPCOMING" ? "Akan Datang" : t.status === "ONGOING" ? "Berlangsung" : "Selesai"}
                    </span>
                  </div>
                </div>
                {t.registrationLink && (
                  <a href={t.registrationLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-5 py-2 bg-gold text-navy-dark text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors text-center">
                    Daftar
                  </a>
                )}
              </div>
            )) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-muted">Belum ada turnamen</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mabar Schedule */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-dark mb-8">
            Jadwal Main Bareng (Mabar)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.length > 0 ? schedules.map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider">{s.dayOfWeek}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">Aktif</span>
                </div>
                <div className="text-3xl font-bold text-navy-dark mb-2">{s.time}</div>
                <h3 className="font-semibold text-navy-dark mb-1">{s.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {s.location}
                </div>
                {s.maxPlayers > 0 && (
                  <p className="text-xs text-muted mt-2">Max. {s.maxPlayers} pemain</p>
                )}
              </div>
            )) : (
              <div className="lg:col-span-3 text-center py-12 bg-white rounded-xl">
                <p className="text-muted">Belum ada jadwal mabar</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
