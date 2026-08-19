import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { ShieldCheck, FileText, Users, Search } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <PublicNavbar />

      {/* Hero Section Maritim */}
      <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-24 px-4 text-center border-b border-slate-800 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30 uppercase tracking-wider">
            ⚓ Maritime Career Platform
          </span>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Selamat Datang di <span className="text-cyan-400">Scouteon</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Platform Portofolio & Karir Pelaut Indonesia terpercaya. Hubungkan
            dokumen kelautanmu dan temukan lowongan kapal terbaik.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="/jobs"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-8 py-3.5 rounded-xl text-sm transition-all"
            >
              Lihat Lowongan Kerja
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">
            Dokumen Terverifikasi
          </h3>
          <p className="text-xs text-slate-400">
            Simpan Buku Pelaut & Sertifikat Keahlian dengan aman.
          </p>
        </div>

        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Pencarian Lowongan</h3>
          <p className="text-xs text-slate-400">
            Filter lowongan sesuai jenis kapal dan jabatan pelaut.
          </p>
        </div>

        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Koneksi Perusahaan</h3>
          <p className="text-xs text-slate-400">
            Terhubung langsung dengan HRD Perusahaan Pelayaran resmi.
          </p>
        </div>

        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Portofolio Digital</h3>
          <p className="text-xs text-slate-400">
            Buat Curriculum Vitae (CV) standar industri maritim.
          </p>
        </div>
      </section>
    </main>
  );
}
