"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default function AdminJobsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, companies(*)")
        .order("created_at", { ascending: false });
      if (data) setJobs(data as unknown as Job[]);
      setLoading(false);
    })();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Hapus lowongan ini?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((j) => j.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">Manajemen Lowongan</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Perusahaan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={4}>
                  Memuat...
                </td>
              </tr>
            )}
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-navy-700">{j.title}</td>
                <td className="px-4 py-3 text-slate-500">{j.companies?.company_name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                    {j.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(j.id)} className="text-red-500 hover:underline">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
