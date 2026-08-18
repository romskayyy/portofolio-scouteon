import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Briefcase, Users, ShieldCheck } from "lucide-react";

export default async function EmployerDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user?.id)
    .single();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("company_id", company?.id);

  const { data: applications } = await supabase
    .from("applications")
    .select("id, jobs!inner(company_id)")
    .eq("jobs.company_id", company?.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">
        Dashboard {company?.company_name || "Perusahaan"}
      </h1>

      {company?.verification_status !== "verified" && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Status verifikasi perusahaan: <strong>{company?.verification_status}</strong>.
          Lengkapi{" "}
          <Link href="/employer/company" className="underline">
            profil perusahaan
          </Link>{" "}
          untuk mempercepat proses approval oleh admin.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Briefcase className="h-5 w-5" />} label="Lowongan Aktif" value={jobs?.length ?? 0} href="/employer/jobs" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Pelamar" value={applications?.length ?? 0} href="/employer/pipeline" />
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Status Verifikasi" value={company?.verification_status ?? "-"} href="/employer/company" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string | number; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm">
      <div className="inline-flex rounded-lg bg-navy-50 p-2 text-navy-600">{icon}</div>
      <p className="mt-3 text-2xl font-bold text-navy-700">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </Link>
  );
}
