"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Application } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";

const STAGE_COLOR: Record<string, string> = {
  applied: "bg-slate-100 text-slate-700",
  shortlisted: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  offer: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
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
      if (!user) return;
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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-700">Lamaran Saya</h1>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-slate-500">Memuat...</p>}
        {!loading && apps.length === 0 && (
          <p className="text-slate-400">Kamu belum melamar pekerjaan apa pun.</p>
        )}
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5"
          >
            <div>
              <p className="font-semibold text-navy-700">{app.jobs?.title}</p>
              <p className="text-sm text-slate-500">{app.jobs?.companies?.company_name}</p>
              <p className="mt-1 text-xs text-slate-400">
                Dilamar: {new Date(app.applied_at).toLocaleDateString("id-ID")}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${STAGE_COLOR[app.stage]}`}
            >
              {STAGE_LABELS[app.stage]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
