"use client";

import { useState, useEffect, useCallback } from "react";
import { socialIcons, parseSocials } from "@/lib/socialIcons";

interface Member {
  id: number;
  name: string;
  position: string;
  photoUrl: string;
  socialMedia: string;
}

interface Props {
  members: Member[];
}

export default function TeamSlideshow({ members }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % members.length);
  }, [members.length]);

  useEffect(() => {
    if (members.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [members.length, next]);

  if (members.length === 0) return null;

  const visible = members.slice(current, current + 5);
  if (visible.length < 5) {
    visible.push(...members.slice(0, 5 - visible.length));
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visible.map((m) => {
          const socials = parseSocials(m.socialMedia);
          return (
            <div key={m.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300">
              <div className="pt-6 pb-3 flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Error"; }} />
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
                {Object.entries(socials).filter(([, v]) => v).length > 0 && (
                  <div className="flex justify-center gap-1.5">
                    {Object.entries(socials).filter(([, v]) => v).map(([key, val]) => {
                      const s = socialIcons[key as keyof typeof socialIcons];
                      if (!s) return null;
                      return (
                        <a
                          key={key}
                          href={s.url(val)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-md bg-surface flex items-center justify-center text-navy-dark/70 hover:text-white hover:bg-gold-dark transition-all duration-200"
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

      {members.length > 5 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: members.length }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === current ? "bg-gold w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
