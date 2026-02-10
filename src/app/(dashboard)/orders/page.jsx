"use client";

import RequireRole from "@/components/common/RequireRole";
import OrderManager from "@/components/features/eventadmin/OrderManager";

export default function OrdersPage() {
  return (
    <RequireRole allowed={["PROMOTOR_EVENT_ADMIN"]}>
      <OrderManager />
    </RequireRole>
  );
}
