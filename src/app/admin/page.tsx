import { createClient } from "@/lib/supabase/server";
import { Users, Briefcase, Building2, FileCheck } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: userCount }, { count: jobCount }, { count: companyCount }, { count: appCount }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("jobs").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("applications").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">Platform Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Total User" value={userCount ?? 0} />
        <Stat icon={<Building2 className="h-5 w-5" />} label="Perusahaan" value={companyCount ?? 0} />
        <Stat icon={<Briefcase className="h-5 w-5" />} label="Lowongan" value={jobCount ?? 0} />
        <Stat icon={<FileCheck className="h-5 w-5" />} label="Total Lamaran" value={appCount ?? 0} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="inline-flex rounded-lg bg-navy-50 p-2 text-navy-600">{icon}</div>
      <p className="mt-3 text-2xl font-bold text-navy-700">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
