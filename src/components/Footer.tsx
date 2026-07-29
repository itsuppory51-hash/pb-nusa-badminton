export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-navy-dark font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold">
                Nusa <span className="text-gold">Badminton</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Club badminton profesional yang berdedikasi untuk mengembangkan bakat dan semangat olahraga bulutangkis.
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
              <li>nusabadminton@gmail.com</li>
              <li>+62 812-3456-7890</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} PB. Nusa Badminton Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
