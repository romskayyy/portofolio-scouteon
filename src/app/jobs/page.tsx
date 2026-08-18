"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import { Search, MapPin, Ship, Calendar } from "lucide-react";

export default function JobsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    loadJobs();
    loadAppliedIds();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const { data } = await supabase
      .from("jobs")
      .select("*, companies(*)")
      .eq("status", "open")
      .order("created_at", { ascending: false });
    if (data) setJobs(data as unknown as Job[]);
    setLoading(false);
  }

  async function loadAppliedIds() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("applications")
      .select("job_id")
      .eq("seafarer_id", user.id);
    if (data) setAppliedIds(data.map((a) => a.job_id));
  }

  async function handleApply(jobId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setApplyingId(jobId);
    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      seafarer_id: user.id,
    });
    if (!error) setAppliedIds([...appliedIds, jobId]);
    setApplyingId(null);
  }

  const filtered = jobs.filter((j) =>
    `${j.title} ${j.rank_required} ${j.vessel_type} ${j.companies?.company_name}`
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-navy-700">Cari Lowongan Pelaut</h1>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm"
          placeholder="Cari berdasarkan rank, jenis kapal, atau perusahaan..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-4">
        {loading && <p className="text-slate-500">Memuat lowongan...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-slate-400">Tidak ada lowongan yang cocok.</p>
        )}
        {filtered.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-navy-700">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.companies?.company_name}</p>
              </div>
              <button
                onClick={() => handleApply(job.id)}
                disabled={appliedIds.includes(job.id) || applyingId === job.id}
                className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600 disabled:bg-slate-300"
              >
                {appliedIds.includes(job.id)
                  ? "Sudah Dilamar"
                  : applyingId === job.id
                  ? "Mengirim..."
                  : "Lamar"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Ship className="h-4 w-4" /> {job.vessel_type} • {job.rank_required}
              </span>
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
              )}
              {job.embarkation_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Embarkasi: {job.embarkation_date}
                </span>
              )}
            </div>
            {job.salary_range && (
              <p className="mt-2 text-sm font-medium text-navy-600">{job.salary_range}</p>
            )}
            {job.description && (
              <p className="mt-3 text-sm text-slate-600 line-clamp-3">{job.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
