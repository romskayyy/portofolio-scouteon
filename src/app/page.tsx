import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="text-4xl">⚓</span>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Selamat Datang di <span className="text-cyan-400">Scouteon</span>
        </h1>
        <p className="text-slate-300 text-base">
          Platform Portofolio & Karir Pelaut Indonesia Terpercaya.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/jobs"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            Lihat Lowongan Kerja
          </Link>
          <Link
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Masuk / Login
          </Link>
        </div>
      </div>
    </main>
  );
}
