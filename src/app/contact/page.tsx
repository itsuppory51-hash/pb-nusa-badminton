import { prisma } from "@/lib/prisma";

async function getData() {
  const profile = await prisma.clubProfile.findFirst();
  return { profile };
}

const socialIcons: Record<string, { label: string; icon: string; url: (v: string) => string }> = {
  whatsapp: {
    label: "WhatsApp",
    icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.099-1.02-1.84-2.278-2.057-2.664-.217-.386-.023-.595.163-.787.168-.172.374-.45.561-.675.186-.225.249-.386.373-.644.124-.257.062-.484-.031-.675-.094-.19-.67-1.622-.922-2.223-.242-.602-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    url: (v) => `https://wa.me/${v.replace(/[^0-9]/g, "")}`,
  },
  instagram: {
    label: "Instagram",
    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    url: (v) => {
      const u = v.replace("@", "");
      return u.startsWith("http") ? u : `https://instagram.com/${u}`;
    },
  },
  facebook: {
    label: "Facebook",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    url: (v) => {
      return v.startsWith("http") ? v : `https://facebook.com/${v}`;
    },
  },
  youtube: {
    label: "YouTube",
    icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    url: (v) => {
      return v.startsWith("http") ? v : `https://youtube.com/${v}`;
    },
  },
  tiktok: {
    label: "TikTok",
    icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
    url: (v) => {
      const u = v.replace("@", "");
      return u.startsWith("http") ? u : `https://tiktok.com/@${u}`;
    },
  },
};

export default async function Contact() {
  const { profile } = await getData();
  let social: Record<string, string> = {};
  try { social = JSON.parse(profile?.socialMedia || "{}"); } catch {}

  const socialLinks = Object.entries(socialIcons)
    .filter(([key]) => social[key])
    .map(([key, s]) => ({ key, ...s, value: social[key] }));

  const contactInfo = [
    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email", value: profile?.email || "nusabadminton@gmail.com", href: `mailto:${profile?.email}` },
    { icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.099-1.02-1.84-2.278-2.057-2.664-.217-.386-.023-.595.163-.787.168-.172.374-.45.561-.675.186-.225.249-.386.373-.644.124-.257.062-.484-.031-.675-.094-.19-.67-1.622-.922-2.223-.242-.602-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z", label: "WhatsApp", value: profile?.phone || "+62 812-3456-7890", href: `https://wa.me/${(profile?.phone || "").replace(/[^0-9]/g, "")}` },
    { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Alamat", value: profile?.address || "Jakarta, Indonesia", href: null },
  ];

  return (
    <div className="pt-24">
      <section className="gradient-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hubungi <span className="text-gold">Kami</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Punya pertanyaan atau ingin bergabung? Hubungi kami!
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-navy-dark mb-6">Informasi Kontak</h2>
              <div className="space-y-6">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={info.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-navy-dark font-semibold hover:text-gold transition-colors">{info.value}</a>
                      ) : (
                        <p className="text-navy-dark font-semibold">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-2xl font-bold text-navy-dark mb-6">Media Sosial</h2>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((s) => (
                      <a
                        key={s.key}
                        href={s.url(s.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 hover:border-gold/30 hover:bg-gold/5 hover:shadow-md transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 text-gold-dark group-hover:text-gold transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d={s.icon} />
                        </svg>
                        <span className="text-sm font-medium text-navy-dark group-hover:text-gold-dark transition-colors">{s.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-navy-dark mb-6">Kirim Pesan</h2>
              <form className="space-y-4">
                <div>
                  <input type="text" placeholder="Nama" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" />
                </div>
                <div>
                  <textarea rows={4} placeholder="Pesan" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm resize-none" />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-gold text-navy-dark font-semibold rounded-xl hover:bg-gold-light transition-all duration-200">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
