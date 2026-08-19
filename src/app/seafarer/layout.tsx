"use client";

import DashboardShell from "@/components/DashboardShell";

export default function SeafarerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <DashboardShell role="seafarer">{children}</DashboardShell>
    </div>
  );
}
