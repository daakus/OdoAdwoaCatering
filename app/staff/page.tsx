import { DashboardCard } from "@/components/layout/dashboard-card";

export default function StaffHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-brand-heading">Today</h1>
      <DashboardCard title="Assigned appointments">
        <p className="text-sm text-muted-foreground">Filtered by staff_id.</p>
      </DashboardCard>
    </div>
  );
}
