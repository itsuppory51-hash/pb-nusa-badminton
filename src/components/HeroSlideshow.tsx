"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
}

interface Props {
  banners: Banner[];
  clubName: string;
  tagline: string;
}

export default function HeroSlideshow({ banners, clubName, tagline }: Props) {
  const [current, setCurrent] = useState(0);
  const hasBanners = banners.length > 0;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (hasBanners) {
    return (
      <section className="min-h-[90vh] flex items-center relative overflow-hidden">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
            style={{
              backgroundImage: `url(${b.imageUrl})`,
              opacity: idx === current ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-navy-dark/70" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Club Badminton Profesional
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-500">
              {banners[current]?.title || clubName}
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl transition-all duration-500">
              {banners[current]?.subtitle || tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/schedule" className="px-8 py-3 bg-gold text-navy-dark font-semibold rounded-xl hover:bg-gold-light transition-all duration-200 shadow-lg shadow-gold/25">
                Lihat Jadwal
              </Link>
              <Link href="/about" className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-200">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>

        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? "bg-gold w-6" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="gradient-navy min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Club Badminton Profesional
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">{clubName}</h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">{tagline}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/schedule" className="px-8 py-3 bg-gold text-navy-dark font-semibold rounded-xl hover:bg-gold-light transition-all duration-200 shadow-lg shadow-gold/25">Lihat Jadwal</Link>
            <Link href="/about" className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-200">Tentang Kami</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
