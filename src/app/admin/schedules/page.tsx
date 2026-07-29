"use client";

import { useEffect, useState } from "react";
import SubmitButton from "@/components/SubmitButton";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function AdminSchedules() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", dayOfWeek: "Senin", time: "", location: "", maxPlayers: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/schedules").then((r) => r.json()).then(setItems);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ title: "", description: "", dayOfWeek: "Senin", time: "", location: "", maxPlayers: 0, isActive: true });
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setForm({ title: item.title, description: item.description, dayOfWeek: item.dayOfWeek, time: item.time, location: item.location, maxPlayers: item.maxPlayers, isActive: item.isActive });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `/api/schedules/${editId}` : "/api/schedules";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, maxPlayers: Number(form.maxPlayers) }) });
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus jadwal ini?")) return;
    await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy-dark">Jadwal Mabar</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">+ Tambah</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy-dark mb-4">{editId ? "Edit" : "Tambah"} Jadwal</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              <textarea placeholder="Deskripsi" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm">
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input placeholder="Waktu (contoh: 19:00)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" required />
              </div>
              <input placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <input type="number" placeholder="Max Pemain (0 = unlimited)" value={form.maxPlayers} onChange={(e) => setForm({ ...form, maxPlayers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold outline-none text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Aktif
              </label>
              <div className="flex gap-2 pt-2">
                <SubmitButton loading={saving} />
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-muted">Belum ada jadwal</p>
          </div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between hover:border-gold/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex flex-col items-center justify-center text-white">
                <span className="text-xs font-medium">{item.dayOfWeek.slice(0, 3)}</span>
                <span className="text-sm font-bold">{item.time}</span>
              </div>
              <div>
                <h3 className="font-semibold text-navy-dark">{item.title}</h3>
                <p className="text-sm text-muted">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${item.isActive ? "bg-green-500" : "bg-gray-300"}`} />
              <button onClick={() => openEdit(item)} className="text-gold-dark hover:text-gold text-sm font-semibold">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 text-sm font-semibold">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
