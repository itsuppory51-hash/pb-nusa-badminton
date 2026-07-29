import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const url = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!url) { console.error("DATABASE_URL not set"); process.exit(1); }
const pool = new Pool({ connectionString: url });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(" seeding sample data...");

  await prisma.banner.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.documentation.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.content.deleteMany();
  await prisma.clubProfile.deleteMany();

  // Club Profile
  await prisma.clubProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "PB. Nusa Badminton Club",
      tagline: "Berkembang Bersama, Bermain dengan Semangat",
      description: `PB. Nusa Badminton Club adalah klub bulutangkis profesional yang berbasis di Jakarta. Kami berdedikasi untuk mengembangkan bakat dan semangat olahraga bulutangkis di Indonesia.

Didirikan pada tahun 2018, kami telah melahirkan banyak atlet berbakat yang berprestasi di tingkat regional maupun nasional. Kami memiliki fasilitas latihan modern dengan 8 lapangan indoor, pelatih bersertifikat nasional, dan program latihan yang terstruktur.

VISI:
Menjadi klub bulutangkis terdepan yang melahirkan atlet-atlet berprestasi dan berkarakter.

MISI:
- Menyediakan program latihan berkualitas tinggi
- Mengembangkan bakat muda melalui pembinaan berjenjang
- Menciptakan lingkungan yang mendukung pertumbuhan atlet
- Berpartisipasi aktif dalam turnamen bulutangkis nasional`,
      logoUrl: "https://api.dicebear.com/9.x/icons/svg?seed=badminton&backgroundColor=D4A847&icon=sports",
      bannerUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80",
      address: "Jl. Olahraga Raya No. 45, Kelapa Gading, Jakarta Utara 14240",
      phone: "+62 812-3456-7890",
      email: "nusabadminton@gmail.com",
      socialMedia: JSON.stringify({
        instagram: "@nusabadminton",
        facebook: "PB Nusa Badminton Club",
        youtube: "Nusa Badminton TV",
        tiktok: "@nusabadminton",
      }),
    },
  });

  // Content pages
  const contents = [
    {
      slug: "about",
      title: "Tentang PB. Nusa Badminton Club",
      content: `Sejarah Berdiri

PB. Nusa Badminton Club didirikan pada 17 Agustus 2018 oleh sekelompok pecinta bulutangkis yang memiliki visi untuk menciptakan klub bulutangkis profesional di Jakarta. Berawal dari latihan rutin di lapangan sewaan dengan 12 anggota, kini kami telah berkembang menjadi klub dengan lebih dari 100 anggota aktif.

Prestasi

Selama perjalanannya, PB. Nusa Badminton Club telah meraih berbagai prestasi membanggakan:
- Juara 1 Turnamen Antar Klub Jakarta 2023
- Juara 2 Kejuaraan Daerah DKI Jakarta 2024
- 3 atlet lolos seleksi Pelatnas 2024
- Juara Umum Liga Bulutangkis Jabodetabek 2024

Fasilitas

Kami menyediakan fasilitas lengkap untuk menunjang latihan:
- 8 Lapangan indoor berstandar nasional
- Fitness center dan ruang gym
- Ruang video analisis pertandingan
- Kantin dan area istirahat
- Parkir luas dan area hijau

Program Latihan

Kami memiliki beberapa program latihan:
1. Program Pemula (Usia 6-12 tahun)
2. Program Menengah (Usia 13-17 tahun)
3. Program Lanjutan (Usia 18+)
4. Program Khusus Turnamen
5. Program Mabar Santai (Umum)`,
      imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80",
      published: true,
    },
    {
      slug: "visi-misi",
      title: "Visi & Misi",
      content: `Visi

Menjadi klub bulutangkis terkemuka di Indonesia yang melahirkan atlet-atlet berprestasi di tingkat nasional dan internasional, serta berkontribusi dalam memajukan olahraga bulutangkis Indonesia.

Misi

1. Menyediakan program pembinaan dan latihan bulutangkis yang berkualitas tinggi dan terstruktur
2. Mengembangkan potensi atlet muda melalui sistem pembinaan berjenjang yang profesional
3. Menciptakan lingkungan yang kondusif dan mendukung pertumbuhan fisik, mental, dan karakter atlet
4. Berpartisipasi aktif dalam berbagai turnamen dan kompetisi bulutangkis
5. Membangun kerjasama dengan berbagai pihak untuk pengembangan olahraga bulutangkis
6. Menjunjung tinggi sportivitas dan nilai-nilai luhur olahraga`,
      imageUrl: "",
      published: true,
    },
  ];

  for (const c of contents) {
    await prisma.content.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  // Tournaments
  const tournaments = [
    {
      title: "Nusa Open Championship 2026",
      description: "Turnamen tahunan PB. Nusa Badminton Club dengan total hadiah Rp 50.000.000.\nKategori: Tunggal Putra, Tunggal Putri, Ganda Putra, Ganda Putri, Ganda Campuran.\nTerbuka untuk umum.",
      date: new Date("2026-09-15"),
      time: "08:00 - 18:00",
      location: "GOR Nusa Badminton, Jakarta",
      registrationLink: "https://forms.google.com/nusa-open-2026",
      posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
      status: "UPCOMING",
    },
    {
      title: "Nusa vs Garuda Friendship Match",
      description: "Pertandingan persahabatan antar klub. Mempererat tali silaturahmi dan mengukur kemampuan atlet.",
      date: new Date("2026-08-20"),
      time: "09:00 - 15:00",
      location: "GOR Garuda, Jakarta Selatan",
      registrationLink: "",
      posterUrl: "",
      status: "UPCOMING",
    },
    {
      title: "Kejuaraan Daerah DKI Jakarta",
      description: "Kejuaraan tingkat provinsi yang diikuti oleh klub-klub bulutangkis se-Jakarta. PB. Nusa akan menurunkan 15 atlet terbaik.",
      date: new Date("2026-07-10"),
      time: "07:30 - 17:00",
      location: "GOR Bulutangkis Jakarta, Senayan",
      registrationLink: "https://daerah.jakarta.go.id/daerah-2026",
      posterUrl: "",
      status: "ONGOING",
    },
    {
      title: "Nusa Internal Tournament",
      description: "Turnamen internal antar anggota klub. Dibagi dalam beberapa kategori berdasarkan level kemampuan.",
      date: new Date("2026-06-25"),
      time: "08:00 - 16:00",
      location: "GOR Nusa Badminton, Jakarta",
      registrationLink: "",
      posterUrl: "",
      status: "COMPLETED",
    },
    {
      title: "Liga Bulutangkis Jabodetabek 2026",
      description: "Kompetisi antar klub se-Jabodetabek. PB. Nusa berpartisipasi dengan 2 tim.",
      date: new Date("2026-05-01"),
      time: "08:00 - 18:00",
      location: "GOR Basket, Cibubur",
      registrationLink: "",
      posterUrl: "",
      status: "COMPLETED",
    },
  ];

  for (const t of tournaments) {
    await prisma.tournament.create({ data: t });
  }

  // Schedules (Mabar)
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const schedules = [
    { title: "Latihan Pemula", description: "Latihan untuk anggota pemula usia 6-12 tahun", dayOfWeek: days[0], time: "15:00 - 17:00", location: "Lapangan 1-2", maxPlayers: 20 },
    { title: "Latihan Lanjutan", description: "Latihan intensif untuk atlet lanjutan", dayOfWeek: days[0], time: "17:00 - 19:00", location: "Lapangan 3-5", maxPlayers: 16 },
    { title: "Mabar Bebas", description: "Sesi main bebas untuk semua anggota", dayOfWeek: days[1], time: "16:00 - 19:00", location: "Lapangan 1-4", maxPlayers: 24 },
    { title: "Latihan Teknik", description: "Fokus pada pukulan dan footwork", dayOfWeek: days[2], time: "15:00 - 17:00", location: "Lapangan 1-3", maxPlayers: 18 },
    { title: "Mabar Kompetitif", description: "Sesi tanding dengan sistem rolling", dayOfWeek: days[3], time: "18:00 - 21:00", location: "Semua Lapangan", maxPlayers: 32 },
    { title: "Latihan Fisik", description: "Latihan kondisi fisik dan stamina", dayOfWeek: days[4], time: "15:00 - 16:30", location: "Fitness Center", maxPlayers: 15 },
    { title: "Mabar Akhir Pekan", description: "Sesi mabar santai akhir pekan", dayOfWeek: days[5], time: "08:00 - 12:00", location: "Lapangan 1-6", maxPlayers: 36 },
    { title: "Turnamen Internal", description: "Pertandingan antar anggota setiap Minggu pertama", dayOfWeek: days[6], time: "08:00 - 14:00", location: "Semua Lapangan", maxPlayers: 40 },
  ];

  for (const s of schedules) {
    await prisma.schedule.create({ data: { ...s, isActive: true } });
  }

  // Gallery
  const galleryImages = [
    { title: "Latihan Rutin", description: "Suasana latihan rutin anggota Nusa Badminton", imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80" },
    { title: "Pertandingan Seru", description: "Momen pertandingan antar anggota", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
    { title: "Fasilitas Lapangan", description: "Lapangan indoor standar nasional", imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&q=80" },
    { title: "Sesi Coaching", description: "Pelatih memberikan arahan kepada atlet", imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80" },
    { title: "Atlet Muda", description: "Atlet muda berbakat Nusa Badminton", imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80" },
    { title: "Persiapan Turnamen", description: "Persiapan atlet sebelum bertanding", imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&q=80&fit=crop&crop=center" },
    { title: "Latihan Fisik", description: "Latihan kondisi fisik dan stamina", imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop&crop=top" },
    { title: "Tim Junior", description: "Tim junior Nusa Badminton Club", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&fit=crop&crop=center" },
    { title: "Shuttlecock", description: "Perlengkapan latihan berkualitas", imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80&fit=crop&crop=center" },
  ];

  for (const g of galleryImages) {
    await prisma.gallery.create({ data: g });
  }

  // Banners
  const banners = [
    { imageUrl: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80", title: "PB. Nusa Badminton Club", subtitle: "Berkembang Bersama, Bermain dengan Semangat", order: 0 },
    { imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80", title: "Latihan Profesional", subtitle: "Fasilitas lengkap dengan pelatih bersertifikat nasional", order: 1 },
    { imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=1600&q=80", title: "Turnamen Bergengsi", subtitle: "Ikuti berbagai turnamen dan kompetisi bulutangkis", order: 2 },
  ];

  for (const b of banners) {
    await prisma.banner.create({ data: { ...b, isActive: true } });
  }

  // Documentation
  const docs = [
    { title: "Dokumentasi Turnamen Nusa Open 2025", date: new Date("2025-09-15"), linkUrl: "https://drive.google.com/drive/folders/sample1", description: "Foto dan video pertandingan Nusa Open 2025" },
    { title: "Latihan Rutin Bulan Agustus", date: new Date("2025-08-20"), linkUrl: "https://youtube.com/playlist?list=sample2", description: "Rekaman sesi latihan rutin bulan Agustus" },
    { title: "Kejuaraan Daerah DKI Jakarta", date: new Date("2025-07-10"), linkUrl: "https://drive.google.com/drive/folders/sample3", description: "Dokumentasi lengkap Kejurda DKI Jakarta 2025" },
    { title: "Mabar Akhir Pekan Spesial", date: new Date("2025-06-28"), linkUrl: "https://youtube.com/watch?v=sample4", description: "Highlight mabar akhir pekan yang seru" },
  ];

  for (const d of docs) {
    await prisma.documentation.create({ data: d });
  }

  console.log(" Sample data seeded successfully!");
  console.log("   - Club Profile: PB. Nusa Badminton Club");
  console.log("   - Content pages: 2 (About, Visi-Misi)");
  console.log("   - Tournaments: 5");
  console.log("   - Schedules: 8");
  console.log("   - Gallery: 9 photos");
  console.log("   - Banners: 3 (slideshow)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
