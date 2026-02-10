"use client";

import RequireRole from "@/components/common/RequireRole";
import EventSelector from "@/components/features/scanstaff/EventSelector";

export default function SelectEventPage() {
  return (
    <RequireRole allowed={["SCAN_STAFF"]}>
      <EventSelector />
    </RequireRole>
  );
}
