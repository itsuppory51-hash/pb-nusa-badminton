"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/club-profile").then((r) => r.json()),
      fetch("/api/contents").then((r) => r.json()),
      fetch("/api/tournaments").then((r) => r.json()),
      fetch("/api/schedules").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
    ]).then(([profile, contents, tournaments, schedules, gallery]) => {
      setStats({
        profile: profile.name ? "Terisi" : "Belum diisi",
        contents: contents.length,
        tournaments: tournaments.length,
        schedules: schedules.length,
        gallery: gallery.length,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-dark mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Profil Club" value={stats.profile || "..."} href="/admin/profile" color="from-gold to-gold-dark" />
        <DashboardCard title="Konten Halaman" value={stats.contents ?? "..."} href="/admin/contents" color="from-blue-500 to-blue-600" />
        <DashboardCard title="Turnamen" value={stats.tournaments ?? "..."} href="/admin/tournaments" color="from-emerald-500 to-emerald-600" />
        <DashboardCard title="Jadwal Mabar" value={stats.schedules ?? "..."} href="/admin/schedules" color="from-purple-500 to-purple-600" />
        <DashboardCard title="Galeri" value={stats.gallery ?? "..."} href="/admin/gallery" color="from-rose-500 to-rose-600" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, href, color }: { title: string; value: string | number; href: string; color: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
      <p className="text-sm text-muted mb-2">{title}</p>
      <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
    </Link>
  );
}
