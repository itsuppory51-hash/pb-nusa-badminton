"use client";

import { useEffect, useState } from "react";

export default function AdminDocumentation() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", date: "", linkUrl: "", description: "" });

  function load() {
    fetch("/api/documentation")
      .then((r) => { if (!r.ok) throw new Error("Gagal load"); return r.json(); })
      .then(setItems)
      .catch(() => setItems([]));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ title: "", date: new Date().toISOString().split("T")[0], linkUrl: "", description: "" });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({ title: item.title, date: new Date(item.date).toISOString().split("T")[0], linkUrl: item.linkUrl, description: item.description });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/documentation/${editId}` : "/api/documentation";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus dokumentasi ini?")) return;
    await fetch(`/api/documentation/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Dokumentasi</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Dokumentasi</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <input placeholder="Link URL (Google Drive, YouTube, dll)" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <textarea placeholder="Deskripsi (opsional)" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm resize-none" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">Simpan</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted">Belum ada dokumentasi</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-navy-dark">Tanggal</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Judul</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Link</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="text-gold-dark hover:text-gold text-xs font-medium truncate block max-w-[200px]">
                      {item.linkUrl}
                    </a>
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
