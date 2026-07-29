"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", imageUrl: "", description: "" });

  function load() {
    fetch("/api/gallery").then((r) => r.json()).then(setItems);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ title: "", imageUrl: "", description: "" });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({ title: item.title, imageUrl: item.imageUrl, description: item.description });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/gallery/${editId}` : "/api/gallery";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus foto ini?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Galeri Foto</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Foto</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <ImageUpload label="Foto" currentUrl={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} />
              <textarea placeholder="Deskripsi" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm resize-none" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">Simpan</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-muted">Belum ada foto</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <img src={item.imageUrl} alt={item.title || ""} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Error"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
              {item.title && <p className="text-white text-sm font-medium">{item.title}</p>}
              <div className="flex gap-2 mt-1">
                <button onClick={() => openEdit(item)} className="text-xs text-gold font-semibold">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-300 font-semibold">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
