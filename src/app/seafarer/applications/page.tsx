"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Application } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";

// Warna status dengan gaya badge maritim yang menyala
const STAGE_COLOR: Record<string, string> = {
  applied: "bg-slate-700/60 text-slate-300 border-slate-600",
  shortlisted: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  interview: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  offer: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  accepted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  rejected: "bg-red-500/20 text-red-500 border-red-500/40",
};

export default function MyApplicationsPage() {
  const supabase = createClient();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("applications")
        .select("*, jobs(*, companies(*))")
        .eq("seafarer_id", user.id)
        .order("applied_at", { ascending: false });
      if (data) setApps(data as unknown as Application[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Banner Welcome Maritim */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">
              ⚓ Maritime Career Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Riwayat Lamaran Saya
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Pantau progres seleksi dan status pengajuan lamaran kerja
              kelautanmu di sini.
            </p>
          </div>

          <Link
            href="/jobs"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            + Cari Lowongan Baru
          </Link>
        </div>

        {/* Daftar Lamaran */}
        <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Daftar Status Pengajuan
          </h2>

          <div className="space-y-3">
            {loading && (
              <div className="py-8 text-center text-slate-400 text-sm">
                ⏳ Memuat riwayat lamaran...
              </div>
            )}

            {!loading && apps.length === 0 && (
              <div className="py-12 text-center bg-slate-900/50 rounded-xl border border-slate-700/50">
                <p className="text-slate-400 text-sm">
                  Kamu belum melamar pekerjaan apa pun.
                </p>
                <Link
                  href="/jobs"
                  className="mt-3 inline-block text-xs font-semibold text-cyan-400 hover:underline"
                >
                  Jelajahi Lowongan Kapal Sekarang →
                </Link>
              </div>
            )}

            {apps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 p-5 gap-4 hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <p className="font-bold text-white text-base">
                    {app.jobs?.title || "Posisi Kapal"}
                  </p>
                  <p className="text-sm text-cyan-400 font-medium mt-0.5">
                    {app.jobs?.companies?.company_name ||
                      "Perusahaan Pelayaran"}
                  </p>
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
                    📅 Dilamar pada:{" "}
                    {new Date(app.applied_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`self-start sm:self-center rounded-full px-3.5 py-1 text-xs font-semibold border ${
                    STAGE_COLOR[app.stage] ||
                    "bg-slate-700 text-slate-300 border-slate-600"
                  }`}
                >
                  {STAGE_LABELS[app.stage] || app.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
