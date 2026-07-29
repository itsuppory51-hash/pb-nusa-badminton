"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label: string;
}

export default function ImageUpload({ currentUrl, onUpload, label }: ImageUploadProps) {
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPreview(data.url);
        onUpload(data.url);
      } else {
        alert(data.error || "Upload gagal");
      }
    } catch {
      alert("Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy-dark mb-2">{label}</label>
      <div className="flex items-start gap-4">
        {preview && (
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border flex-shrink-0">
            <img src={preview} alt={label} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            id={`upload-${label}`}
          />
          <label
            htmlFor={`upload-${label}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pilih Gambar
              </>
            )}
          </label>
          <p className="text-xs text-muted mt-1.5">Format: JPG, PNG, WEBP. Max 5MB</p>
        </div>
      </div>
    </div>
  );
}
