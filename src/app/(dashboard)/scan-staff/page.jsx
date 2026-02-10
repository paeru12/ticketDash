"use client";

import RequireRole from "@/components/common/RequireRole";
import StaffManager from "@/components/features/eventadmin/StaffManager";

export default function ScanStaffPage() {
  return (
    <RequireRole allowed={["EVENT_ADMIN"]}>
      <StaffManager />
    </RequireRole>
  );
}
