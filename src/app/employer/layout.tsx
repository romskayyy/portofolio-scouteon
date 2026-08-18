import DashboardShell from "@/components/DashboardShell";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="employer">{children}</DashboardShell>;
}
