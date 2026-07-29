"use client";

import { useState, useRef, useEffect } from "react";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label: string;
}

export default function ImageUpload({ currentUrl, onUpload, label }: ImageUploadProps) {
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(currentUrl || "");

  useEffect(() => {
    if (currentUrl) {
      setPreview(currentUrl);
      setUrlValue(currentUrl);
    }
  }, [currentUrl]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        alert(data.error || "Upload gagal. Gunakan URL gambar.");
        setShowUrlInput(true);
      }
    } catch {
      alert("Upload gagal. Gunakan URL gambar.");
      setShowUrlInput(true);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleUrlSubmit() {
    if (urlValue) {
      setPreview(urlValue);
      onUpload(urlValue);
      setShowUrlInput(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy-dark mb-2">{label}</label>
      <div className="flex items-start gap-4">
        {preview && (
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border flex-shrink-0">
            <img src={preview} alt={label} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Error"; }} />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id={`file-${label}`} />
          <div className="flex items-center gap-2">
            <label htmlFor={`file-${label}`} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              {uploading ? "Mengupload..." : "Pilih Gambar"}
            </label>
            <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="text-xs text-muted hover:text-gold transition-colors">
              {showUrlInput ? "Batal" : "atau URL"}
            </button>
          </div>
          {showUrlInput && (
            <div className="flex gap-2">
              <input type="text" value={urlValue} onChange={(e) => setUrlValue(e.target.value)} placeholder="https://...jpg" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold" />
              <button type="button" onClick={handleUrlSubmit} className="px-3 py-1.5 bg-gold text-navy-dark text-sm font-semibold rounded-lg hover:bg-gold-light">Pakai</button>
            </div>
          )}
          <p className="text-xs text-muted">Format: JPG, PNG, WEBP. Max 5MB</p>
        </div>
      </div>
    </div>
  );
}
