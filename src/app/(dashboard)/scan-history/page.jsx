"use client";

import RequireRole from "@/components/common/RequireRole";
import ScanHistory from "@/components/features/scanstaff/ScanHistory";

export default function ScanHistoryPage() {
  return (
    <RequireRole allowed={["SCAN_STAFF"]}>
      <ScanHistory />
    </RequireRole>
  );
}
