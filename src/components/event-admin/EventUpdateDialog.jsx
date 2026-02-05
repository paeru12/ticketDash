import { useState } from "react";
import EventStepOne from "@/components/event-admin/EventStepOne";
import { updateEvents } from "@/lib/eventApi";
import { successAlert, errorAlert } from "@/lib/alert";

export default function EventUpdateDialog({ event, onClose, onSuccess, openDialog, dialogMode, setOpenDialog, handleSuccess }) {
  const [data, setData] = useState({
    // FILE
    flyer: null,
    flyerPreview: event.image,
    layout: null,
    layoutPreview: event.layout_venue,

    // FIELD SESUAI BACKEND
    name: event.name || "",
    creatorId: event.creator_id || "",
    region: event.region_id || "",
    category: event.kategori_id || "",
    location: event.location || "",
    province: event.province || "",
    district: event.district || "",
    mapUrl: event.map || "",
    startDate: event.date_start || null,
    endDate: event.date_end || null,
    startTime: event.time_start || null,
    endTime: event.time_end || null,
    description: event.deskripsi || "",
    terms: event.sk || "",
    status: event.status || "",
    timezone: event.timezone || "",
    keywords: event.keywords
      ? event.keywords.split(",").map(k => k.trim())
      : [],
  });

  async function submit() {
    try {
      const fd = new FormData();

      /* ===============================
         FIELD YANG DIIZINKAN JOI
      =============================== */
      if (data.name) fd.append("name", data.name);
      if (data.creatorId) fd.append("creator_id", data.creatorId);
      if (data.region) fd.append("region_id", data.region);
      // ADDED: Support new Province/District fields
      if (data.province) fd.append("province", data.province);
      if (data.district) fd.append("district", data.district);
      if (data.category) fd.append("kategori_id", data.category);
      if (data.location) fd.append("location", data.location);
      if (data.mapUrl) fd.append("map", data.mapUrl);
      if (data.timezone) fd.append("timezone", data.timezone);

      fd.append("date_start", data.startDate || null);
      fd.append("date_end", data.endDate || null);
      fd.append("time_start", data.startTime || null);
      fd.append("time_end", data.endTime || null);

      if (data.description) fd.append("deskripsi", data.description);
      if (data.terms) fd.append("sk", data.terms);
      if (data.status) fd.append("status", data.status);
      if (data.keywords.length)
        fd.append("keywords", data.keywords.join(","));

      /* ===============================
         FILE (TIDAK DI-VALIDATE JOI)
      =============================== */
      if (data.flyer instanceof File) {
        fd.append("image", data.flyer);
      }

      if (data.layout instanceof File) {
        fd.append("layout_venue", data.layout);
      }

      await updateEvents(event.id, fd);

      await successAlert("Berhasil", "Event berhasil diperbarui");
      onSuccess?.();   // 🔁 refresh list
      onClose?.();
    } catch (e) {
      errorAlert("Gagal", e.response?.data?.message || e.message);
    }
  }

  return (
    <EventStepOne
      data={data}
      onChange={setData}
      onNext={submit}
      onCancel={onClose}
      isEdit
    />
  );
}