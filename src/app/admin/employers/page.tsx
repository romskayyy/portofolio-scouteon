"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/lib/types";
import { Check, X } from "lucide-react";

export default function AdminEmployersPage() {
  const supabase = createClient();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    setLoading(true);
    const { data } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setCompanies(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: "verified" | "rejected") {
    await supabase.from("companies").update({ verification_status: status }).eq("id", id);
    setCompanies((c) =>
      c.map((x) => (x.id === id ? { ...x, verification_status: status } : x))
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">Approval Employer</h1>
      <p className="mt-1 text-slate-500">
        Verifikasi perusahaan sebelum mereka dapat memposting lowongan.
      </p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-slate-500">Memuat...</p>}
        {companies.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <p className="font-semibold text-navy-700">{c.company_name}</p>
              <p className="text-sm text-slate-500">{c.company_type || "-"} • {c.address || "Alamat belum diisi"}</p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  c.verification_status === "verified"
                    ? "bg-green-100 text-green-700"
                    : c.verification_status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {c.verification_status}
              </span>
            </div>
            {c.verification_status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(c.id, "verified")}
                  className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-600"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => updateStatus(c.id, "rejected")}
                  className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" /> Tolak
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
