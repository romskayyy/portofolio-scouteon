import Link from "next/link";
import { Anchor } from "lucide-react";

export default function PublicNavbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-navy-700">
          <Anchor className="h-6 w-6 text-teal-600" />
          <span className="text-xl">Scouteon</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/jobs" className="hover:text-navy-600">
            Cari Lowongan
          </Link>
          <Link href="/employers" className="hover:text-navy-600">
            Untuk Perusahaan
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-navy-600"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
