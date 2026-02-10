"use client";

import React from "react";
import ScanQRCode from "@/components/scanstaff/ScanQRCode";

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

export default function EventSelector() {
    const [selectedEvent, setSelectedEvent] = React.useState(null);

    const handleSelect = (item) => {
        setSelectedEvent(item);
    };

    if (selectedEvent) {
        return (
            <ScanQRCode
                eventData={selectedEvent}
                onBack={() => setSelectedEvent(null)}
            />
        );
    }

    return (
        <div className="max-w-md mx-auto text-slate-900">
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Select Event</h2>
                <p className="text-sm text-slate-500">
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
              border border-slate-200 rounded-xl p-4
              bg-white shadow-sm
              hover:bg-slate-50
              hover:border-blue-500
              hover:ring-1 hover:ring-blue-500
              transition-all
            "
                    >
                        <p className="font-semibold text-slate-900">{item.eventName}</p>
                        <p className="text-sm text-slate-500 mt-1">{item.gateName}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}
