import React, { useState } from "react";
import EventList from "@/components/event-admin/EventList";
import EventCreate from "@/components/event-admin/EventCreate";

export default function Events() {
  const [view, setView] = useState("list"); // list | create

  return (
    <div>
      {view === "list" && (
        <EventList onAdd={() => setView("create")} />
      )}

      {view === "create" && (
        <EventCreate onCancel={() => setView("list")} />
      )}
    </div>
  );
}
 