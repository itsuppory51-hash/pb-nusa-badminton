"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import SubmitButton from "@/components/SubmitButton";

export default function AdminContents() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", content: "", imageUrl: "", published: false });
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/contents").then((r) => r.json()).then(setItems);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ slug: "", title: "", content: "", imageUrl: "", published: false });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({ slug: item.slug, title: item.title, content: item.content, imageUrl: item.imageUrl, published: item.published });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `/api/contents/${editId}` : "/api/contents";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus konten ini?")) return;
    await fetch(`/api/contents/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Konten Halaman</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">
          + Tambah Konten
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Konten</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Slug (contoh: about)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <textarea placeholder="Konten (format teks)" rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm resize-none" />
              <ImageUpload label="Gambar" currentUrl={form.imageUrl} onUpload={(url) => setForm({ ...form, imageUrl: url })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                Published
              </label>
              <div className="flex gap-2 pt-2">
                <SubmitButton loading={saving} />
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted">Belum ada konten</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-navy-dark">Slug</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Judul</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Status</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.slug}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.published ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"}`}>
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-gold-dark hover:text-gold text-xs font-semibold">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
