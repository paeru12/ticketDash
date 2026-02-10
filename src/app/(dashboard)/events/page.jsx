"use client";

import RoleRenderer from "@/components/common/RoleRenderer";
import GlobalEventManager from "@/components/features/superadmin/GlobalEventManager";
import EventOrchestrator from "@/components/features/eventadmin/EventOrchestrator";

export default function EventsPage() {
  return (
    <RoleRenderer
      map={{
        SUPERADMIN: <GlobalEventManager />,
        PROMOTOR_EVENT_ADMIN: <EventOrchestrator />,
      }}
    />
  );
}
