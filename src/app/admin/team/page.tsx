"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import SubmitButton from "@/components/SubmitButton";
import { socialIcons, parseSocials } from "@/lib/socialIcons";

const EMPTY_FORM = {
  name: "",
  position: "",
  photoUrl: "",
  order: 0,
  socials: {} as Record<string, string>,
};

export default function AdminTeam() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/team-members")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({
      name: item.name,
      position: item.position,
      photoUrl: item.photoUrl,
      order: item.order,
      socials: parseSocials(item.socialMedia),
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        position: form.position,
        photoUrl: form.photoUrl,
        order: parseInt(String(form.order)) || 0,
        socialMedia: JSON.stringify(form.socials),
      };
      const url = editId ? `/api/team-members/${editId}` : "/api/team-members";
      const method = editId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus anggota ini?")) return;
    await fetch(`/api/team-members/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Anggota Tim</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Anggota</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Nama Lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <input placeholder="Posisi / Peran (mis. Ketua, Pelatih, Anggota)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <ImageUpload label="Foto" currentUrl={form.photoUrl} onUpload={(url) => setForm({ ...form, photoUrl: url })} />
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Urutan</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-navy-dark mb-3">Media Sosial</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(socialIcons).map(([key, s]) => (
                    <label key={key} className="block">
                      <span className="text-xs font-medium text-muted mb-1 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                        {s.label}
                      </span>
                      <input
                        value={form.socials[key] || ""}
                        onChange={(e) => setForm({ ...form, socials: { ...form.socials, [key]: e.target.value } })}
                        placeholder={key === "whatsapp" ? "6281234567890" : "username atau link"}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <SubmitButton loading={saving} />
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-muted">Belum ada anggota tim</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gold/30 hover:shadow-lg transition-all duration-200">
            <div className="aspect-square bg-gray-100">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Error"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold-dark/20">
                  <span className="text-4xl font-bold text-gold-dark">{item.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-navy-dark text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted truncate">{item.position || "Anggota"}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(item)} className="text-xs text-gold-dark font-semibold">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 font-semibold">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
