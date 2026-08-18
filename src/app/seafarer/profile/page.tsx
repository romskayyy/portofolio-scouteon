"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SeafarerProfile, SeaServiceHistory } from "@/lib/types";
import { Plus, Trash2, Save } from "lucide-react";

export default function SeafarerProfilePage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<SeafarerProfile>>({});
  const [history, setHistory] = useState<SeaServiceHistory[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: sp } = await supabase
        .from("seafarer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (sp) setProfile(sp);

      const { data: hist } = await supabase
        .from("sea_service_history")
        .select("*")
        .eq("seafarer_id", user.id)
        .order("sign_on_date", { ascending: false });
      if (hist) setHistory(hist);

      setLoading(false);
    })();
  }, []);

  async function handleSaveProfile() {
    if (!userId) return;
    setSaving(true);
    await supabase.from("seafarer_profiles").upsert({ id: userId, ...profile });
    setSaving(false);
  }

  async function handleAddHistory() {
    if (!userId) return;
    const { data, error } = await supabase
      .from("sea_service_history")
      .insert({
        seafarer_id: userId,
        vessel_name: "",
        vessel_type: "",
        rank: "",
        company_name: "",
        sign_on_date: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();
    if (data) setHistory([data, ...history]);
  }

  async function handleUpdateHistory(id: string, field: string, value: string) {
    setHistory((h) => h.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
    await supabase.from("sea_service_history").update({ [field]: value }).eq("id", id);
  }

  async function handleDeleteHistory(id: string) {
    await supabase.from("sea_service_history").delete().eq("id", id);
    setHistory((h) => h.filter((x) => x.id !== id));
  }

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-700">Profil & CV</h1>
      <p className="mt-1 text-slate-500">
        Data ini digunakan untuk membuat CV otomatis dan dilihat oleh employer.
      </p>

      {/* Data pribadi */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-navy-700">Data Pribadi & Preferensi</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Rank Saat Ini">
            <input
              className="input"
              value={profile.rank || ""}
              onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
              placeholder="e.g. Third Officer"
            />
          </Field>
          <Field label="Rank yang Diinginkan">
            <input
              className="input"
              value={profile.desired_rank || ""}
              onChange={(e) => setProfile({ ...profile, desired_rank: e.target.value })}
              placeholder="e.g. Second Officer"
            />
          </Field>
          <Field label="Jenis Kapal yang Diinginkan">
            <input
              className="input"
              value={profile.desired_vessel_type || ""}
              onChange={(e) => setProfile({ ...profile, desired_vessel_type: e.target.value })}
              placeholder="e.g. Container, Tanker, Bulk Carrier"
            />
          </Field>
          <Field label="Gaji yang Diinginkan (USD)">
            <input
              type="number"
              className="input"
              value={profile.desired_salary ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, desired_salary: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Tersedia Mulai">
            <input
              type="date"
              className="input"
              value={profile.available_from || ""}
              onChange={(e) => setProfile({ ...profile, available_from: e.target.value })}
            />
          </Field>
          <Field label="Kewarganegaraan">
            <input
              className="input"
              value={profile.nationality || ""}
              onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio Singkat">
            <textarea
              className="input min-h-[90px]"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </Field>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </section>

      {/* Sea service history */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-navy-700">Sea Service History</h2>
          <button
            onClick={handleAddHistory}
            className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600"
          >
            <Plus className="h-4 w-4" /> Tambah
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {history.length === 0 && (
            <p className="text-sm text-slate-400">Belum ada riwayat pelayaran.</p>
          )}
          {history.map((h) => (
            <div key={h.id} className="rounded-lg border border-slate-200 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="Nama Kapal"
                  value={h.vessel_name || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "vessel_name", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Jenis Kapal"
                  value={h.vessel_type || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "vessel_type", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Rank"
                  value={h.rank || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "rank", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Perusahaan"
                  value={h.company_name || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "company_name", e.target.value)}
                />
                <input
                  type="date"
                  className="input"
                  value={h.sign_on_date || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "sign_on_date", e.target.value)}
                />
                <input
                  type="date"
                  className="input"
                  value={h.sign_off_date || ""}
                  onChange={(e) => handleUpdateHistory(h.id, "sign_off_date", e.target.value)}
                />
              </div>
              <button
                onClick={() => handleDeleteHistory(h.id)}
                className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus
              </button>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: #1d4e89;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
