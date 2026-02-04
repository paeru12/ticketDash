import React from "react";
import { useNavigate } from "react-router-dom";

/** ================= MOCK DATA ================= */
const EVENT_GATE_LIST = [
  {
    id: "1",
    eventId: "evt-1",
    eventName: "Konser",
    gateId: "gate-vip",
    gateName: "Gate VIP",
  },
  {
    id: "2",
    eventId: "evt-2",
    eventName: "Pameran",
    gateId: "gate-1",
    gateName: "Gate 1",
  },
  {
    id: "3",
    eventId: "evt-2",
    eventName: "Pameran",
    gateId: "gate-2",
    gateName: "Gate 2",
  },
  {
    id: "4",
    eventId: "evt-3",
    eventName: "Konser Dangdut",
    gateId: "gate-1",
    gateName: "Gate 1",
  },
];

const SelectEvent = () => {
  const navigate = useNavigate();

  const handleSelect = (item) => {
    navigate("/scan-staff/scan", {
      state: {
        eventId: item.eventId,
        gateId: item.gateId,
        eventName: item.eventName,
        gateName: item.gateName,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Select Event</h2>
        <p className="text-sm text-muted-foreground">
          Pilih event sebelum scan ticket
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {EVENT_GATE_LIST.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="
              w-full text-left
              border rounded-lg p-4
              bg-white
              hover:bg-muted/50
              hover:border-blue-500
              transition
            "
          >
            <p className="font-medium">{item.eventName}</p>
            <p className="text-sm text-muted-foreground">{item.gateName}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectEvent;
