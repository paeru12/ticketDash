import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ellipsis, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getEvents, deleteEvents } from "@/lib/eventApi";
import EventActionDialog from "./EventActionDialog";
import { formatTanggalIndo, formatEventDateTime } from "@/utils/date";
import { confirmAlert, successAlert, errorAlert } from "@/lib/alert";
export default function EventList({ onAdd }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    perPage: 6,
    totalItems: 0,
    totalPages: 1,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [dialog, setDialog] = useState({
    open: false,
    mode: null,
    data: null,
  });

  function openDialog(mode, data) {
    setDialog({ open: true, mode, data });
  }

  function closeDialog() {
    setDialog({ open: false, mode: null, data: null });
  }

  function handleSuccess() {
    closeDialog();
    fetchEvents(); // 🔁 AUTO REFRESH
  }

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    fetchEvents();
  }, [page, perPage, search]);

  async function fetchEvents() {
    try {
      setLoading(true);
      const res = await getEvents({ page, perPage, search });
      console.log(res);
      const mediaBase = res.media;
      setData(
        res.events.map((item) => ({
          ...item, // ⬅️ SIMPAN SEMUA DATA ASLI
          // tambahan khusus UI tabel
          tanggalPelaksanaan: `${formatEventDateTime({
            startDate: item.date_start,
            startTime: item.time_start,
            endDate: item.date_end,
            endTime: item.time_end,
            zone: item.timezone,
          })}`,
          author: item.users.full_name,
          venue: item.location,
          start: formatTanggalIndo(item.date_start),
          end: formatTanggalIndo(item.date_end),
          image: item.image
            ? `${mediaBase}${item.image.replace(/^\/+/, "")}`
            : "",
          layout_venue: item.layout_venue
            ? `${mediaBase}${item.layout_venue.replace(/^\/+/, "")}`
            : "",
        }))
      );
      setMeta(res.meta);
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(event) {
    const res = await confirmAlert({
      title: "Hapus Event?",
      text: `Event "${event.name}" akan dihapus permanen.`,
      confirmText: "Hapus",
      confirmColor: "#ef4444",
    });

    if (!res.isConfirmed) return;

    try {
      await deleteEvents(event.id);
      await successAlert("Berhasil", "Event berhasil dihapus");
      fetchEvents(); // 🔁 refresh list
    } catch (e) {
      errorAlert(
        "Gagal",
        e.response?.data?.message || e.message
      );
    }
  }


  /* =========================
     RENDER
  ========================= */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Events</h2>
        <Button onClick={onAdd}>+ Add Event</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search & PerPage */}
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={6}>6 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>

        {/* Info */}
        <div className="text-sm text-slate-600 mb-2">
          Showing{" "}
          <strong>{(meta.page - 1) * meta.perPage + 1}</strong> –{" "}
          <strong>
            {Math.min(meta.page * meta.perPage, meta.totalItems)}
          </strong>{" "}
          of <strong>{meta.totalItems}</strong>
        </div>

        {/* Table */}
        <table className="w-full text-sm divide-y">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Gambar</th>
              <th className="px-3 py-2">Nama Event</th>
              <th className="px-3 py-2">Venue</th>
              <th className="px-3 py-2">Tanggal Pelaksanaan</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Data kosong
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold">
                    {(meta.page - 1) * meta.perPage + idx + 1}.
                  </td>

                  <td className="px-3 py-3">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">
                        No Image
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3 font-medium capitalize">{row.name}</td>
                  <td className="px-3 py-3 capitalize">{row.venue}</td>
                  <td className="px-3 py-3">{row.tanggalPelaksanaan}</td>

                  <td className="px-3 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded
                        ${row.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : row.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                        `}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 capitalize">{row.author}</td>


                  <td className="px-3 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-slate-100">
                          <Ellipsis size={16} />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDialog("detail", row)}>
                          Detail Event
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openDialog("update-event", row)}>
                          Edit Event
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openDialog("update-ticket", row)}>
                          Edit Ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(row)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Hapus Event
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination – SAMA DENGAN KATEGORI */}
        {meta.totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </Button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === meta.page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </Button>
          </div>
        )}
      </div>

      <EventActionDialog
        open={dialog.open}
        mode={dialog.mode}
        data={dialog.data}
        onClose={closeDialog}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
