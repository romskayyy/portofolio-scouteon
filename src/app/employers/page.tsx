import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { Briefcase, Users, ShieldCheck } from "lucide-react";

export default function EmployersLandingPage() {
  return (
    <main>
      <PublicNavbar />
      <section className="bg-gradient-to-b from-navy-700 to-navy-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold">Rekrut Pelaut Terbaik, Lebih Cepat</h1>
          <p className="mx-auto mt-4 max-w-xl text-navy-100">
            Posting lowongan, kelola kandidat, dan pantau recruitment pipeline
            kamu dalam satu dashboard.
          </p>
          <Link
            href="/register?role=employer"
            className="mt-8 inline-block rounded-lg bg-teal-500 px-6 py-3 font-semibold hover:bg-teal-600"
          >
            Daftar Sebagai Perusahaan
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <Feature
            icon={<Briefcase className="h-6 w-6" />}
            title="Posting Lowongan"
            desc="Buat dan kelola lowongan sesuai rank, jenis kapal, dan kebutuhan kontrak."
          />
          <Feature
            icon={<Users className="h-6 w-6" />}
            title="Applicant Tracking"
            desc="Lihat profil, sea service history, dan dokumen kandidat dalam satu tempat."
          />
          <Feature
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Recruitment Pipeline"
            desc="Kelola kandidat dari lamaran hingga penempatan dengan tampilan kanban."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex rounded-lg bg-teal-50 p-2 text-teal-600">{icon}</div>
      <h3 className="font-semibold text-navy-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
