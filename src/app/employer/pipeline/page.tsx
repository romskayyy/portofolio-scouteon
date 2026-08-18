"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Application, ApplicationStage } from "@/lib/types";
import { STAGE_LABELS } from "@/lib/types";

const STAGES: ApplicationStage[] = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "accepted",
  "rejected",
];

export default function PipelinePage() {
  const supabase = createClient();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .single();
    if (!company) return;

    const { data } = await supabase
      .from("applications")
      .select("*, jobs!inner(*, companies!inner(*)), seafarer_profiles(*, profiles(*))")
      .eq("jobs.company_id", company.id)
      .order("applied_at", { ascending: false });

    if (data) setApps(data as unknown as Application[]);
    setLoading(false);
  }

  async function moveStage(appId: string, newStage: ApplicationStage) {
    setApps((a) => a.map((x) => (x.id === appId ? { ...x, stage: newStage } : x)));
    await supabase.from("applications").update({ stage: newStage }).eq("id", appId);
  }

  if (loading) return <p className="text-slate-500">Memuat pipeline...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">Recruitment Pipeline</h1>
      <p className="mt-1 text-slate-500">
        Kelola kandidat dari semua lowongan perusahaan kamu.
      </p>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = apps.filter((a) => a.stage === stage);
          return (
            <div key={stage} className="w-72 flex-shrink-0">
              <div className="rounded-t-xl bg-navy-600 px-4 py-2 text-sm font-semibold text-white">
                {STAGE_LABELS[stage]} ({stageApps.length})
              </div>
              <div className="min-h-[200px] space-y-2 rounded-b-xl border border-t-0 border-slate-200 bg-slate-50 p-3">
                {stageApps.map((app) => (
                  <div key={app.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold text-navy-700">
                      {app.seafarer_profiles?.profiles?.full_name || "Kandidat"}
                    </p>
                    <p className="text-xs text-slate-500">{app.jobs?.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {app.seafarer_profiles?.rank}
                    </p>
                    <select
                      value={app.stage}
                      onChange={(e) => moveStage(app.id, e.target.value as ApplicationStage)}
                      className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {STAGE_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
