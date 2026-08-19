"use client";

import { useState } from "react";

export default function SeafarerProfilePage() {
  const [fullName, setFullName] = useState("Naufal Romi");
  const [rank, setRank] = useState("Second Officer");
  const [seamanBookNo, setSeamanBookNo] = useState("E-12345678");
  const [experienceYears, setExperienceYears] = useState("4");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);

    // Simulasi penyimpanan data ke database
    setTimeout(() => {
      setSaving(false);
      setToastMessage("Data profil pelaut berhasil diperbarui!");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
        {/* Header Profil */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-2xl border-2 border-cyan-500 shadow-md">
            ⚓
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profil Pelaut</h1>
            <p className="text-sm text-slate-500">
              Kelola data dokumen dan riwayat kelautanmu
            </p>
          </div>
        </div>

        {/* Notifikasi Reaksi Simpan (Toast Alert) */}
        {toastMessage && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 animate-fade-in">
            ✅ {toastMessage}
          </div>
        )}

        {/* Form Profil */}
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Jabatan / Rank Saat Ini
              </label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nomor Buku Pelaut (Seaman Book)
              </label>
              <input
                type="text"
                value={seamanBookNo}
                onChange={(e) => setSeamanBookNo(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Pengalaman Berlayar (Tahun)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="mt-1 block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Bagian Checklist Sertifikat */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              Sertifikat Kelautan yang Dimiliki:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                BST (Basic Safety)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                AFF (Advanced Fire)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                SCRB
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                MFA (Medical First Aid)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                GMDSS
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-slate-900 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-6 rounded-lg transition-colors duration-150 flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {saving ? "Menyimpan Data..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
