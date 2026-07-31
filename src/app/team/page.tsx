import { prisma } from "@/lib/prisma";
import { socialIcons, parseSocials } from "@/lib/socialIcons";

async function getData() {
  const members = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return { members };
}

export default async function TeamPage() {
  const { members } = await getData();

  return (
    <div className="pt-24">
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="text-gold">Team</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Kenali orang-orang di balik PB. Nusa Badminton Club
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {members.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted">Belum ada anggota tim</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {members.map((m) => {
                const socials = parseSocials(m.socialMedia);
                const links = Object.entries(socials).filter(([, v]) => v);
                return (
                  <div key={m.id} className="group bg-surface rounded-xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300">
                    <div className="pt-6 pb-3 flex justify-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold-dark/20">
                            <span className="text-2xl font-bold text-gold-dark">{m.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="px-3 pb-4 text-center">
                      <h3 className="font-semibold text-navy-dark text-sm mb-0.5 truncate">{m.name}</h3>
                      <p className="text-xs text-muted mb-2.5 truncate">{m.position || "Anggota"}</p>
                      {links.length > 0 && (
                        <div className="flex justify-center gap-1.5">
                          {links.map(([key, val]) => {
                            const s = socialIcons[key as keyof typeof socialIcons];
                            if (!s) return null;
                            return (
                              <a
                                key={key}
                                href={s.url(val)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center text-navy-dark/70 hover:text-white hover:bg-gold-dark hover:border-gold-dark transition-all duration-200"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d={s.icon} />
                                </svg>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
