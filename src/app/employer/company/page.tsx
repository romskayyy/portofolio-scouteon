"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/lib/types";
import { Save } from "lucide-react";

export default function CompanyProfilePage() {
  const supabase = createClient();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();
      if (data) setCompany(data);
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    await supabase.from("companies").update(company).eq("id", company.id);
    setSaving(false);
  }

  if (loading) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy-700">Profil Perusahaan</h1>
      <p className="mt-1 text-slate-500">
        Lengkapi profil untuk verifikasi dan menarik minat pelaut.
      </p>

      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Field label="Nama Perusahaan">
          <input
            className="input"
            value={company.company_name || ""}
            onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
          />
        </Field>
        <Field label="Jenis Perusahaan">
          <input
            className="input"
            placeholder="Manning Agency / Shipowner / dst"
            value={company.company_type || ""}
            onChange={(e) => setCompany({ ...company, company_type: e.target.value })}
          />
        </Field>
        <Field label="Alamat">
          <input
            className="input"
            value={company.address || ""}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
          />
        </Field>
        <Field label="Website">
          <input
            className="input"
            value={company.website || ""}
            onChange={(e) => setCompany({ ...company, website: e.target.value })}
          />
        </Field>
        <Field label="Deskripsi">
          <textarea
            className="input min-h-[100px]"
            value={company.description || ""}
            onChange={(e) => setCompany({ ...company, description: e.target.value })}
          />
        </Field>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
