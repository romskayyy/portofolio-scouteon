export const dynamic = "force-dynamic";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { ShieldCheck, FileText, Users, Search } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-navy-700 to-navy-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Menghubungkan Pelaut dengan
            <br className="hidden sm:block" /> Peluang Karier Terbaik
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-100">
            Scouteon adalah platform rekrutmen dan manajemen pelaut — profil
            digital, sertifikat, lamaran kerja, dan rekrutmen perusahaan
            pelayaran, semua dalam satu tempat.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register?role=seafarer"
              className="rounded-lg bg-teal-500 px-6 py-3 font-semibold hover:bg-teal-600"
            >
              Saya Pelaut — Cari Kerja
            </Link>
            <Link
              href="/register?role=employer"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold hover:bg-white/20"
            >
              Saya Perusahaan — Rekrut Pelaut
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-navy-700">
          Semua yang Dibutuhkan dalam Satu Platform
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Users className="h-6 w-6" />}
            title="Profil & CV Digital"
            desc="Riwayat karier, sea service history, dan CV otomatis untuk pelaut."
          />
          <Feature
            icon={<FileText className="h-6 w-6" />}
            title="Manajemen Dokumen"
            desc="Simpan sertifikat & dokumen dengan notifikasi masa berlaku."
          />
          <Feature
            icon={<Search className="h-6 w-6" />}
            title="Pencarian Lowongan"
            desc="Cari & lamar posisi sesuai rank, jenis kapal, dan gaji yang diinginkan."
          />
          <Feature
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Recruitment Pipeline"
            desc="Employer kelola kandidat dari lamaran hingga penempatan."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex rounded-lg bg-teal-50 p-2 text-teal-600">
        {icon}
      </div>
      <h3 className="font-semibold text-navy-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}
