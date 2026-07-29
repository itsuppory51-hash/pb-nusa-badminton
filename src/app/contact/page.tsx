import { prisma } from "@/lib/prisma";

async function getData() {
  const profile = await prisma.clubProfile.findFirst();
  return { profile };
}

export default async function Contact() {
  const { profile } = await getData();

  const contactInfo = [
    { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email", value: profile?.email || "nusabadminton@gmail.com" },
    { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Telepon", value: profile?.phone || "+62 812-3456-7890" },
    { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Alamat", value: profile?.address || "Jakarta, Indonesia" },
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
                      <p className="text-navy-dark font-semibold">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
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
