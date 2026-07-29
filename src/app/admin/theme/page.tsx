"use client";

import { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";

const defaults = {
  "color-navy": "#1E3A5F",
  "color-navy-light": "#2D5A8E",
  "color-navy-dark": "#0F172A",
  "color-gold": "#D4A847",
  "color-gold-light": "#E8C76A",
  "color-gold-dark": "#B8922E",
  "color-surface": "#F8FAFC",
  "color-muted": "#64748B",
};

const labels: Record<string, string> = {
  "color-navy": "Navy (Utama)",
  "color-navy-light": "Navy Light",
  "color-navy-dark": "Navy Dark",
  "color-gold": "Gold (Aksen)",
  "color-gold-light": "Gold Light",
  "color-gold-dark": "Gold Dark",
  "color-surface": "Surface (Latar)",
  "color-muted": "Muted (Teks Sekunder)",
};

const groups = [
  { title: "Warna Utama", keys: ["color-navy", "color-navy-light", "color-navy-dark"] },
  { title: "Warna Aksen", keys: ["color-gold", "color-gold-light", "color-gold-dark"] },
  { title: "Latar & Teks", keys: ["color-surface", "color-muted"] },
];

export default function AdminTheme() {
  const [theme, setTheme] = useState<Record<string, string>>(defaults);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const merged: Record<string, string> = { ...defaults };
        for (const [k, v] of Object.entries(data || {})) {
          if (k in defaults) merged[k] = String(v);
        }
        setTheme(merged);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      if (res.ok) {
        setMsg("Tema berhasil disimpan! Refresh halaman untuk melihat perubahan.");
      } else {
        setMsg("Gagal menyimpan");
      }
    } catch {
      setMsg("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    if (!confirm("Reset semua warna ke default?")) return;
    setTheme(defaults);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Pengaturan Tema</h1>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-200 text-muted text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Default
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes("berhasil") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {groups.map((group) => (
          <div key={group.title} className="bg-white rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-navy-dark mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.keys.map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-navy-dark mb-2">
                    {labels[key]}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme[key]}
                      onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                      className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={theme[key]}
                      onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <SubmitButton loading={saving} label="Simpan Tema" />
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 max-w-2xl">
        <strong>Tips:</strong> Perubahan warna akan langsung terlihat setelah halaman di-refresh. Kamu bisa memilih warna langsung dengan color picker, atau ketik kode hex-nya.
      </div>
    </div>
  );
}
