"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mx-auto mb-4">
            <span className="text-navy-dark font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-dark">Admin Login</h1>
          <p className="text-muted text-sm mt-1">PB. Nusa Badminton Club</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-dark mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        <a href="/" className="block text-center text-sm text-muted hover:text-gold mt-4 transition-colors">
          &larr; Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
