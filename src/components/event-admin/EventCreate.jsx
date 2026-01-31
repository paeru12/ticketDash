import { useState } from "react";
import EventStepOne from "./EventStepOne";
import EventStepTwo from "./EventStepTwo";
import { createEvents } from "@/lib/eventApi";
import { successAlert, errorAlert } from "@/lib/alert";
export default function EventCreate({ onCancel }) {
  const [step, setStep] = useState(1);

  /* ================= STATE UTAMA ================= */
  const [eventData, setEventData] = useState({
    // STEP 1 – Event
    event: {
      name: "",
      category: "",
      region: "",
      startDate: "",
      endDate: "",
      flyer: null,
      layout: null,
      description: "",
      status: "",
    },
  });

  /* ================= TICKETS ================= */
  const [tickets, setTickets] = useState([
    {
      id: Date.now().toString(),
      qty: "",
      price: "",
      maxOrder: "",
      description: "",
    },
  ]);

  const [activeTicketId, setActiveTicketId] = useState(tickets[0].id);

  async function handleFinish() {
    try {
      const e = eventData.event;
      const formData = new FormData();

      // EVENT
      formData.append("creator_id", e.creatorId);
      formData.append("region_id", e.region);
      formData.append("kategori_id", e.category);
      formData.append("name", e.name);
      formData.append("deskripsi", e.description);
      formData.append("sk", e.terms);
      formData.append("status", e.status);

      formData.append("date_start", e.startDate);
      formData.append("date_end", e.endDate);
      formData.append("time_start", e.startTime);
      formData.append("time_end", e.endTime);
      formData.append("timezone", e.timezone);

      formData.append("location", e.location);
      formData.append("map", e.mapUrl || "");
      formData.append("keywords", e.keywords.join(","));

      // FILE (WAJIB FILE)
      if (e.flyer instanceof File) {
        formData.append("image", e.flyer);
      }

      if (e.layout instanceof File) {
        formData.append("layout_venue", e.layout);
      }

      // TICKETS
      const ticketPayload = tickets.map((t) => ({
        name: t.name,
        deskripsi: t.description,
        price: Number(t.price),
        total_stock: Number(t.qty),
        max_per_order: Number(t.maxOrder),
        deliver_ticket: t.deliverDate,
        date_start: t.startDate,
        date_end: t.endDate,
        time_start: t.startTime,
        time_end: t.endTime,
      }));

      formData.append("ticket_types", JSON.stringify(ticketPayload));

      await createEvents(formData);
      await successAlert("Berhasil", "Event berhasil dibuat");
      onCancel();

    } catch (err) {
      errorAlert("Gagal", err.response?.data?.message || err.message);
      // console.error(err);
    }
  }


  return (
    <div className="bg-white p-6 rounded-lg">

      {step === 1 && (
        <EventStepOne
          data={eventData.event}
          onChange={(event) =>
            setEventData((prev) => ({
              ...prev,
              event,
            }))
          }
          onNext={() => setStep(2)}
          onCancel={onCancel}
        />
      )}

      {step === 2 && (
        <EventStepTwo
          tickets={tickets}
          setTickets={setTickets}
          activeTicketId={activeTicketId}
          setActiveTicketId={setActiveTicketId}
          onBackStep={() => setStep(1)}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
}

