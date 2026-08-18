"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import { Plus, Trash2, X } from "lucide-react";

const emptyForm = {
  title: "",
  rank_required: "",
  vessel_type: "",
  vessel_name: "",
  contract_duration: "",
  salary_range: "",
  embarkation_date: "",
  location: "",
  description: "",
  requirements: "",
};

export default function EmployerJobsPage() {
  const supabase = createClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
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
      setCompanyId(company.id);
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (data) setJobs(data);
    })();
  }, []);

  async function handleCreate() {
    if (!companyId || !form.title) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("jobs")
      .insert({ ...form, company_id: companyId })
      .select()
      .single();
    if (data) {
      setJobs([data, ...jobs]);
      setForm(emptyForm);
      setShowForm(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((j) => j.filter((x) => x.id !== id));
  }

  async function handleToggleStatus(job: Job) {
    const newStatus = job.status === "open" ? "closed" : "open";
    await supabase.from("jobs").update({ status: newStatus }).eq("id", job.id);
    setJobs((js) => js.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-700">Lowongan Saya</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-2 text-sm font-medium text-white hover:bg-teal-600"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Batal" : "Buat Lowongan"}
        </button>
      </div>

      {showForm && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input" placeholder="Judul Lowongan" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" placeholder="Rank Dibutuhkan" value={form.rank_required} onChange={(e) => setForm({ ...form, rank_required: e.target.value })} />
            <input className="input" placeholder="Jenis Kapal" value={form.vessel_type} onChange={(e) => setForm({ ...form, vessel_type: e.target.value })} />
            <input className="input" placeholder="Nama Kapal" value={form.vessel_name} onChange={(e) => setForm({ ...form, vessel_name: e.target.value })} />
            <input className="input" placeholder="Durasi Kontrak" value={form.contract_duration} onChange={(e) => setForm({ ...form, contract_duration: e.target.value })} />
            <input className="input" placeholder="Range Gaji" value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />
            <input type="date" className="input" placeholder="Tanggal Embarkasi" value={form.embarkation_date} onChange={(e) => setForm({ ...form, embarkation_date: e.target.value })} />
            <input className="input" placeholder="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <textarea className="input mt-4 min-h-[80px]" placeholder="Deskripsi Pekerjaan" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="input mt-4 min-h-[80px]" placeholder="Persyaratan" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <button
            onClick={handleCreate}
            disabled={saving}
            className="mt-4 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Publikasikan Lowongan"}
          </button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-navy-700">{job.title}</p>
                <p className="text-sm text-slate-500">
                  {job.rank_required} • {job.vessel_type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(job)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    job.status === "open" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {job.status === "open" ? "Terbuka" : "Ditutup"}
                </button>
                <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:underline">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && !showForm && (
          <p className="text-sm text-slate-400">Belum ada lowongan dibuat.</p>
        )}
      </div>

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
