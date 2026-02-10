"use client";

import RequireRole from "@/components/common/RequireRole";
import CategoryManager from "@/components/features/eventadmin/CategoryManager";

export default function CategoriesPage() {
  return (
    <RequireRole allowed={["PROMOTOR_EVENT_ADMIN"]}>
      <CategoryManager />
    </RequireRole>
  );
}
