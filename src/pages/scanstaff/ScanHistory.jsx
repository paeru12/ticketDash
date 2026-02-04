// src/pages/scanfstaff/ScanHistory.jsx

import React from "react";

const MOCK_LOGS = [
  {
    id: "1",
    ticket_id: "VALID123",
    result: "SUCCESS",
    scanned_at: "2026-01-13 09:12",
  },
  {
    id: "2",
    ticket_id: "INVALID999",
    result: "FAILED",
    scanned_at: "2026-01-13 09:18",
  },
];

const ScanHistory = () => {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Scan History (Today)</h1>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Ticket ID</th>
              <th className="text-left p-3">Result</th>
              <th className="text-left p-3">Scanned At</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-3">{log.ticket_id}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.result === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.result}
                  </span>
                </td>
                <td className="p-3">{log.scanned_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScanHistory;
