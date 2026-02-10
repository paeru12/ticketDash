"use client";

import RequireRole from "@/components/common/RequireRole";
import ReportStatistics from "@/components/features/eventadmin/ReportStatistics";

export default function ReportsPage() {
  return (
    <RequireRole allowed={["EVENT_ADMIN"]}>
      <ReportStatistics />
    </RequireRole>
  );
}
