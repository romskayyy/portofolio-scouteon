"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Lowongan Kerja", href: "/jobs" },
    { name: "Dashboard Pelaut", href: "/seafarer/dashboard" },
    { name: "Profil Saya", href: "/seafarer/profile" },
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Scouteon */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/20">
            ⚓
          </span>
          <span className="text-xl font-extrabold text-white tracking-wider">
            SCOUTEON{" "}
            <span className="text-cyan-400 text-xs tracking-normal font-medium">
              MARITIME
            </span>
          </span>
        </Link>

        {/* Links Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
