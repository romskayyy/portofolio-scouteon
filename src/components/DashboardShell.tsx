"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Anchor,
  LayoutDashboard,
  UserCircle,
  FileText,
  Search,
  Briefcase,
  Users,
  MessageSquare,
  LogOut,
  ShieldCheck,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const NAV_BY_ROLE: Record<"seafarer" | "employer" | "admin", NavItem[]> = {
  seafarer: [
    { href: "/seafarer", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/seafarer/profile", label: "Profil & CV", icon: <UserCircle className="h-4 w-4" /> },
    { href: "/seafarer/documents", label: "Dokumen & Sertifikat", icon: <FileText className="h-4 w-4" /> },
    { href: "/jobs", label: "Cari Lowongan", icon: <Search className="h-4 w-4" /> },
    { href: "/seafarer/applications", label: "Lamaran Saya", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/seafarer/messages", label: "Pesan", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  employer: [
    { href: "/employer", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/employer/company", label: "Profil Perusahaan", icon: <UserCircle className="h-4 w-4" /> },
    { href: "/employer/jobs", label: "Lowongan Saya", icon: <Briefcase className="h-4 w-4" /> },
    { href: "/employer/pipeline", label: "Recruitment Pipeline", icon: <Users className="h-4 w-4" /> },
    { href: "/employer/messages", label: "Pesan", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: "/admin/users", label: "Manajemen User", icon: <Users className="h-4 w-4" /> },
    { href: "/admin/employers", label: "Approval Employer", icon: <ShieldCheck className="h-4 w-4" /> },
    { href: "/admin/jobs", label: "Manajemen Lowongan", icon: <Briefcase className="h-4 w-4" /> },
  ],
};

export default function DashboardShell({
  role,
  children,
}: {
  role: "seafarer" | "employer" | "admin";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const items = NAV_BY_ROLE[role];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-5 font-bold text-navy-700">
          <Anchor className="h-6 w-6 text-teal-600" />
          Scouteon
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-navy-50 text-navy-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
