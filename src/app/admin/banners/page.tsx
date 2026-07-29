"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}

export default function AdminBanners() {
  const [items, setItems] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ imageUrl: "", title: "", subtitle: "", linkUrl: "", order: 0, isActive: true });

  function load() {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((data) => setItems(data));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ imageUrl: "", title: "", subtitle: "", linkUrl: "", order: items.length, isActive: true });
    setShowForm(true);
  }

  function openEdit(item: Banner) {
    setEditId(item.id);
    setForm({ imageUrl: item.imageUrl, title: item.title, subtitle: item.subtitle, linkUrl: item.linkUrl, order: item.order, isActive: item.isActive });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/banners/${editId}` : "/api/banners";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus banner ini?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    load();
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const a = items[index];
    const b = items[index - 1];
    await fetch(`/api/banners/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) });
    await fetch(`/api/banners/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) });
    load();
  }

  async function moveDown(index: number) {
    if (index === items.length - 1) return;
    const a = items[index];
    const b = items[index + 1];
    await fetch(`/api/banners/${a.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: b.order }) });
    await fetch(`/api/banners/${b.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: a.order }) });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Banner Slideshow</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah Banner</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Banner</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <ImageUpload label="Gambar Banner" currentUrl={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} />
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <input placeholder="Subtitle (opsional)" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <input placeholder="Link URL (opsional)" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Urutan</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
                </div>
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                    Aktif
                  </label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">Simpan</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-muted">Belum ada banner. Tambah banner untuk slideshow hero!</p>
          </div>
        ) : items.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gold/30 transition-all">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-32 flex-shrink-0 bg-gray-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-navy-dark">{item.title || "(tanpa judul)"}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isActive ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  {item.subtitle && <p className="text-sm text-muted">{item.subtitle}</p>}
                  <p className="text-xs text-muted mt-1">Urutan: {item.order}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30">▲</button>
                  <button onClick={() => moveDown(idx)} disabled={idx === items.length - 1} className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30">▼</button>
                  <button onClick={() => openEdit(item)} className="text-gold-dark hover:text-gold text-xs font-semibold ml-auto">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
