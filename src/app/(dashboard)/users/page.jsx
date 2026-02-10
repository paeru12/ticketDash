"use client";

import RequireRole from "@/components/common/RequireRole";
import UserManagement from "@/components/features/superadmin/UserManagement";

export default function UsersPage() {
  return (
    <RequireRole allowed={["SUPERADMIN"]}>
      <UserManagement />
    </RequireRole>
  );
}
