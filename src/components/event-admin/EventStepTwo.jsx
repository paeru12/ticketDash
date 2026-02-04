import {
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/common/RichTextEditor";
import { confirmAlert } from "@/lib/alert";
import { formatRupiah, parseRupiah } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "", label: "Pilih Status" },
  { value: "available", label: "Available" },
  { value: "draft", label: "Draft" },
];

export default function EventStepTwo({
  tickets = [],
  setTickets,
  onDeleteTicket,
  onBackStep,
  onFinish,
  readOnly = false,
  hideAction = false,
  isEdit = false,
}) {

  const topRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);


  /* ================= ACTIVE TICKET ================= */
  const [localActiveId, setLocalActiveId] = useState(null);

  const resolvedActiveTicketId =
    tickets.find(t => t.id === localActiveId)?.id ||
    tickets[0]?.id;


  const activeTicket = tickets.find(
    (t) => t.id === resolvedActiveTicketId
  );

  if (!activeTicket) {
    return (
      <div className="p-4 border rounded-md text-sm text-slate-500">
        Tidak ada data ticket
      </div>
    );
  }

  /* ================= UTIL ================= */
  function isEmptyHTML(html) {
    return !html || html.replace(/<[^>]*>/g, "").trim() === "";
  }

  function setActiveTicket(id) {
    setLocalActiveId(id);
  }


  /* ================= VALIDATION ================= */
  function validateTicket(t) {
    const e = {};
    if (!t.name?.trim()) e.name = true;
    if (isEmptyHTML(t.description)) e.description = true;
    if (!t.price || Number(t.price) <= 0) e.price = true;
    if (!t.qty || Number(t.qty) <= 0) e.qty = true;
    if (!t.maxOrder || Number(t.maxOrder) <= 0) e.maxOrder = true;
    if (!t.status) e.status = true;
    if (!t.deliverDate) e.deliverDate = true;
    if (!t.startDate) e.startDate = true;
    if (!t.endDate) e.endDate = true;
    if (!t.startTime) e.startTime = true;
    if (!t.endTime) e.endTime = true;
    return e;
  }

  function update(key, value) {
    if (readOnly) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === resolvedActiveTicketId
          ? { ...t, [key]: value }
          : t
      )
    );
  }

  /* ================= ACTION ================= */
  async function addTicket() {
    if (readOnly) return;

    const e = validateTicket(activeTicket);
    if (Object.keys(e).length) {
      setErrors(e);
      setShowError(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const newTicket = {
      id: `tmp-${Date.now()}`, // ⬅️ JANGAN numeric
      isNew: true,
      name: "",
      description: "",
      price: "",
      qty: "",
      sold: 0,
      maxOrder: "",
      status: "",
      deliverDate: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
    };

    setTickets([...tickets, newTicket]);
    setLocalActiveId(newTicket.id);
    setActiveTicket?.(newTicket.id);
    setErrors({});
    setShowError(false);
  }

  async function deleteTicket() {
    if (readOnly || tickets.length === 1) return;

    const res = await confirmAlert({
      title: "Hapus Ticket?",
      text: "Ticket yang dihapus tidak dapat dikembalikan.",
      confirmText: "Hapus",
    });

    if (!res.isConfirmed) return;

    const deletedId = resolvedActiveTicketId;

    // hapus di parent
    await onDeleteTicket?.(deletedId);

    // 🔥 SET ACTIVE KE TICKET PERTAMA YANG TERSISA
    const remaining = tickets.filter(t => t.id !== deletedId);

    if (remaining.length > 0) {
      setLocalActiveId(remaining[0].id);
    } else {
      setLocalActiveId(null);
    }
  }

  async function finish() {
    if (readOnly) return;

    const invalid = tickets.find(
      (t) => Object.keys(validateTicket(t)).length
    );

    if (invalid) {
      setActiveTicket(invalid.id);
      setErrors(validateTicket(invalid));
      setShowError(true);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    onFinish?.();
  }

  /* ================= UI ================= */
  return (
    <div ref={topRef} className="space-y-6 p-4">
      <h2 className="text-lg font-semibold">
        {isEdit ? "" : "Event – Step 2 (Ticket)"}
      </h2>

      {showError && !readOnly && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-700 rounded">
          Lengkapi semua field yang wajib diisi
        </div>
      )}

      {/* MOBILE & DESKTOP CONSISTENT */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12">
        {/* LIST TICKET */}
        <div className="md:col-span-4 border rounded-lg divide-y">
          <div className="p-3 bg-slate-50 font-medium text-sm">
            List Ticket
          </div>

          {tickets.map((t, i) => {
            const valid = !Object.keys(validateTicket(t)).length;
            const active = t.id === resolvedActiveTicketId;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTicket?.(t.id);
                  setLocalActiveId(t.id);
                }}
                className={`w-full px-4 py-3 flex justify-between text-left transition
                  ${active ? "bg-slate-100 border-l-4 border-blue-500" : "hover:bg-slate-50"}
                  ${readOnly ? "cursor-pointer" : "cursor-pointer"}
                `}
              >
                <div>
                  <div className="font-medium">Ticket {i + 1}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {t.name || "Belum diisi"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {valid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </button>
            );
          })}


          {!readOnly && (
            <div className="p-3">
              <Button className="w-full gap-2" onClick={addTicket}>
                <Plus className="w-4 h-4" />
                Tambah Ticket
              </Button>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="md:col-span-8 border rounded-lg p-4 space-y-4 bg-white overflow-y-auto">
          <div>
            <label className="text-sm font-medium">Nama Ticket *</label>
            <Input
              disabled={readOnly}
              value={activeTicket.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Deskripsi *</label>
            <div className={`rounded-lg border
                ${readOnly ? "pointer-events-none bg-slate-50" : ""}
              `}>
              <RichTextEditor
                value={activeTicket.description}
                readOnly={readOnly}
                compact
                onChange={
                  readOnly
                    ? undefined
                    : (v) => update("description", v)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Harga *</label>
              <Input
                disabled={readOnly}
                value={formatRupiah(activeTicket.price)}
                onChange={(e) =>
                  update("price", parseRupiah(e.target.value))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Total Stok *</label>
              <Input
                disabled={readOnly}
                type="number"
                value={activeTicket.qty}
                onChange={(e) => update("qty", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max / Order *</label>
              <Input
                disabled={readOnly}
                type="number"
                value={activeTicket.maxOrder}
                onChange={(e) =>
                  update("maxOrder", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="text-sm font-medium">Tanggal Mulai Penjualan *</label>
              <Input
                disabled={readOnly}
                type="date"
                value={activeTicket.startDate}
                onChange={(e) =>
                  update("startDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jam Mulai Penjualan *</label>
              <Input
                disabled={readOnly}
                type="time"
                value={activeTicket.startTime}
                onChange={(e) =>
                  update("startTime", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Selesai Penjualan *</label>
              <Input
                disabled={readOnly}
                type="date"
                value={activeTicket.endDate}
                onChange={(e) =>
                  update("endDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Jam Selesai Penjualan *</label>
              <Input
                disabled={readOnly}
                type="time"
                value={activeTicket.endTime}
                onChange={(e) =>
                  update("endTime", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Tanggal Kirim Ticket *
              </label>
              <Input
                disabled={readOnly}
                type="date"
                value={activeTicket.deliverDate}
                onChange={(e) =>
                  update("deliverDate", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status Ticket *</label>
              <select
                disabled={readOnly}
                className="w-full h-10 border rounded px-3"
                value={activeTicket.status}
                onChange={(e) =>
                  update("status", e.target.value)
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {!hideAction && (
        <div className="flex justify-between pt-4">
          {isEdit ? "" :
            <Button variant="outline" onClick={onBackStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          }

          <div className="flex gap-2">
            {tickets.length > 1 && (
              <Button variant="destructive" onClick={deleteTicket}>
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            )}
            <Button onClick={finish}>
              <Check className="w-4 h-4 mr-2" />
              {isEdit ? "Update" : "Selesai"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

