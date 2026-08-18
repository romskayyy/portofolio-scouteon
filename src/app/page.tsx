import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import { ShieldCheck, FileText, Users, Search } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <PublicNavbar />
      <section className="bg-gradient-to-b from-navy-700 to-navy-900 py-20 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Scouteon</h1>
        <p className="text-lg mb-6">
          Platform Portofolio & Karir Pelaut Indonesia
        </p>
        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
        >
          Mulai Sekarang
        </Link>
      </section>
    </main>
  );
}
