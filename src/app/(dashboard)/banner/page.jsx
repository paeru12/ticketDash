"use client";

import RequireRole from "@/components/common/RequireRole";
import BannerManagement from "@/components/features/superadmin/BannerManagement";

export default function BannerPage() {
  return (
    <RequireRole allowed={["SUPERADMIN"]}>
      <BannerManagement />
    </RequireRole>
  );
}
