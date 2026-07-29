"use client";

interface Props {
  loading: boolean;
  label?: string;
  loadingLabel?: string;
}

export default function SubmitButton({ loading, label = "Simpan", loadingLabel = "Menyimpan..." }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-navy-dark font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-navy-dark border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}
