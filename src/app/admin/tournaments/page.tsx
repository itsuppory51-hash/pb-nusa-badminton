"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

export default function AdminTournaments() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", registrationLink: "", posterUrl: "", status: "UPCOMING" });

  function load() {
    fetch("/api/tournaments").then((r) => r.json()).then(setItems);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ title: "", description: "", date: "", time: "", location: "", registrationLink: "", posterUrl: "", status: "UPCOMING" });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({
      title: item.title, description: item.description,
      date: new Date(item.date).toISOString().split("T")[0],
      time: item.time, location: item.location,
      registrationLink: item.registrationLink, posterUrl: item.posterUrl, status: item.status,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/tournaments/${editId}` : "/api/tournaments";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus turnamen ini?")) return;
    await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Turnamen</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Turnamen</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <textarea placeholder="Deskripsi" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
                <input placeholder="Waktu (contoh: 08:00)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              </div>
              <input placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <input placeholder="Link Pendaftaran" value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <ImageUpload label="Poster" currentUrl={form.posterUrl} onUpload={(url) => setForm({ ...form, posterUrl: url })} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm">
                <option value="UPCOMING">Akan Datang</option>
                <option value="ONGOING">Berlangsung</option>
                <option value="COMPLETED">Selesai</option>
              </select>
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
          <div className="p-8 text-center text-muted">Belum ada turnamen</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-navy-dark">Judul</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Tanggal</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Status</th>
                <th className="px-4 py-3 font-semibold text-navy-dark">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "UPCOMING" ? "bg-blue-50 text-blue-600" :
                      item.status === "ONGOING" ? "bg-green-50 text-green-600" :
                      "bg-gray-50 text-gray-500"
                    }`}>{item.status}</span>
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
