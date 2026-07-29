"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import SubmitButton from "@/components/SubmitButton";

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", logoUrl: "", bannerUrl: "",
    address: "", phone: "", email: "", socialMedia: "{}",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/club-profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setForm({
            name: data.name || "",
            tagline: data.tagline || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
            bannerUrl: data.bannerUrl || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            socialMedia: data.socialMedia || "{}",
          });
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/club-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsg("Berhasil disimpan!");
      } else {
        setMsg("Gagal menyimpan");
      }
    } catch {
      setMsg("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-dark mb-8">Profil Club</h1>
      {msg && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes("Berhasil") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {msg}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-100 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageUpload
            label="Logo Club"
            currentUrl={form.logoUrl}
            onUpload={(url) => setForm({ ...form, logoUrl: url })}
          />
          <ImageUpload
            label="Banner / Foto Hero"
            currentUrl={form.bannerUrl}
            onUpload={(url) => setForm({ ...form, bannerUrl: url })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Club" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-dark mb-1">Deskripsi</label>
          <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Alamat" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="Telepon" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        </div>
        <div className="pt-2">
          <SubmitButton loading={saving} />
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-dark mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm" />
    </div>
  );
}
