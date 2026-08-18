import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertTriangle, FileText, Briefcase, UserCircle } from "lucide-react";

export default async function SeafarerDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, stage")
    .eq("seafarer_id", user?.id);

  const { data: expiringDocs } = await supabase
    .from("documents")
    .select("id, document_name, expiry_date")
    .eq("seafarer_id", user?.id)
    .lte("expiry_date", new Date(Date.now() + 30 * 86400000).toISOString())
    .order("expiry_date", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">
        Halo, {profile?.full_name || "Pelaut"} 👋
      </h1>
      <p className="mt-1 text-slate-500">
        Ini ringkasan aktivitas dan profil kamu di Scouteon.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Total Lamaran"
          value={applications?.length ?? 0}
          href="/seafarer/applications"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Dokumen Akan Expire"
          value={expiringDocs?.length ?? 0}
          href="/seafarer/documents"
          warn={(expiringDocs?.length ?? 0) > 0}
        />
        <StatCard
          icon={<UserCircle className="h-5 w-5" />}
          label="Lengkapi Profil"
          value="Cek"
          href="/seafarer/profile"
        />
      </div>

      {expiringDocs && expiringDocs.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Sertifikat Akan Segera Kedaluwarsa
          </div>
          <ul className="mt-3 space-y-1 text-sm text-amber-700">
            {expiringDocs.map((d) => (
              <li key={d.id}>
                {d.document_name} — kedaluwarsa {d.expiry_date}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-navy-700">Langkah Selanjutnya</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>
            •{" "}
            <Link href="/seafarer/profile" className="text-navy-600 hover:underline">
              Lengkapi profil & sea service history
            </Link>{" "}
            agar CV otomatis kamu siap dilihat employer.
          </li>
          <li>
            •{" "}
            <Link href="/seafarer/documents" className="text-navy-600 hover:underline">
              Upload sertifikat & dokumen wajib
            </Link>{" "}
            (STCW, paspor, buku pelaut, medical).
          </li>
          <li>
            •{" "}
            <Link href="/jobs" className="text-navy-600 hover:underline">
              Cari lowongan
            </Link>{" "}
            sesuai rank dan jenis kapal yang kamu inginkan.
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  href: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-5 transition hover:shadow-sm ${
        warn ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className={`inline-flex rounded-lg p-2 ${warn ? "bg-amber-100 text-amber-700" : "bg-navy-50 text-navy-600"}`}>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-navy-700">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </Link>
  );
}
