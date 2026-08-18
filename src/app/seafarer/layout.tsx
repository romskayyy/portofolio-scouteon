import DashboardShell from "@/components/DashboardShell";

export default function SeafarerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="seafarer">{children}</DashboardShell>;
}
