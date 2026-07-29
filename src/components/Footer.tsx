import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const profile = await prisma.clubProfile.findFirst();

  return (
    <footer className="bg-navy-dark text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-navy-dark font-bold text-sm">N</span>
                </div>
              )}
              <span className="text-white font-semibold">
                {(profile?.name || "Nusa").split(" ")[0]} <span className="text-gold">{(profile?.name || "Badminton").split(" ").slice(1).join(" ") || "Badminton"}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              {profile?.description ? profile.description.split("\n")[0] : "Club badminton profesional yang berdedikasi untuk mengembangkan bakat dan semangat olahraga bulutangkis."}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-gold transition-colors">Beranda</a></li>
              <li><a href="/about" className="hover:text-gold transition-colors">Tentang</a></li>
              <li><a href="/schedule" className="hover:text-gold transition-colors">Jadwal</a></li>
              <li><a href="/gallery" className="hover:text-gold transition-colors">Galeri</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li>{profile?.email || "nusabadminton@gmail.com"}</li>
              <li>{profile?.phone || "+62 812-3456-7890"}</li>
              <li>{profile?.address || "Jakarta, Indonesia"}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} {profile?.name || "PB. Nusa Badminton Club"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
