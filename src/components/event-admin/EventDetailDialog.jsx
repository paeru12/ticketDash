import { formatEventDateTime } from "@/utils/date";

export default function EventDetailDialog({ event }) {
    const imageUrl = event.image;
    console.log("Event Detail:", event);

    return (
        <>
            {/* detail event */}
            <div className="flex-1 sm:flex gap-3 p-3 border-b flex-shrink-0">
                {/* ================= HERO POSTER ================= */}
                <div className="w-full flex justify-center items-center max-h-[30vh] overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={event.name}
                            className="w-full h-auto object-contain"
                        />
                    ) : (
                        <div className="py-20 text-sm text-slate-400">
                            No Event Poster
                        </div>
                    )}
                </div>

                {/* ================= EVENT HEADER ================= */}
                <div className="p-4">
                    <h2 className="text-normal md:text-xl font-bold mb-1 capitalize">{event.name}</h2>

                    <div className="text-xs md:text-sm text-slate-500 mb-3">
                        Organizer:{" "}
                        <span className="font-medium text-slate-700 capitalize">
                            {event.creators?.name || "-"}
                        </span>
                    </div>
                    <div className="text-xs md:text-sm text-slate-500 mb-3">
                        Author:{" "}
                        <span className="font-medium text-slate-700 capitalize">
                            {event.users?.full_name || "-"}
                        </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 capitalize">
                            {event.kategoris?.name || "Uncategorized"}
                        </span>

                        <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-700 capitalize">
                            {event.regions?.name || "No Region"}
                        </span>

                        <span className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700 capitalize">
                            {event.status}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-5 text-xs md:text-sm">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <div className="text-slate-500">Tanggal & Waktu</div>
                        <div className="font-medium">
                            {formatEventDateTime({
                                startDate: event.date_start,
                                startTime: event.time_start,
                                endDate: event.date_end,
                                endTime: event.time_end,
                                zone: event.timezone,
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="text-slate-500">Lokasi</div>
                        <div className="font-medium">
                            <p>{event.location}</p>
                            {event.map && (
                                <a
                                href={event.map}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                                >
                                    Lihat Maps
                                </a>
                            )}
                        </div>
                            {event.layout_venue && (
                                <div className="w-full flex justify-center items-center max-h-[30vh] overflow-hidden mb-4">
                                    <img
                                        src={event.layout_venue}
                                        alt="Layout Venue"
                                        className="w-full h-auto object-contain rounded-md border"
                                    />
                                </div>
                            )}
                    </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Harga Mulai</div>
                    <div className="text-xl font-bold">
                        Rp {Number(event.lowest_price).toLocaleString("id-ID")}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500 mb-1">Deskripsi</div>
                    <div className="text-slate-700 whitespace-pre-line
                                    prose-ol:list-decimal
                                    prose-ul:list-disc
                                    prose-li:ml-4"
                        dangerouslySetInnerHTML={{ __html: event.deskripsi }}
                    />
                </div>

                <div>
                    <div className="text-slate-500 mb-2">Jenis Tiket</div>

                    {!event.ticket_types?.length ? (
                        <div className="text-sm text-slate-400 italic">
                            Belum ada tiket untuk event ini
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {event.ticket_types.map((ticket) => {
                                const sold = Number(ticket.ticket_sold || 0);
                                const total = Number(ticket.total_stock || 0);
                                const remaining = Math.max(total - sold, 0);

                                return (
                                    <div
                                        key={ticket.id}
                                        className="border rounded-lg p-4 flex justify-between gap-4"
                                    >

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold capitalize">{ticket.name}</h4>

                                                <span className={`px-2 py-0.5 text-xs rounded ${ticket.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {ticket.is_active ? "Aktif" : "Nonaktif"}
                                                </span>

                                                <StatusBadge status={ticket.status} />
                                            </div>

                                            <div className="text-xs text-slate-500 space-y-1">
                                                <div>
                                                    Berlaku:{" "}
                                                    <span className="font-medium">
                                                        {formatEventDateTime({
                                                            startDate: ticket.date_start,
                                                            startTime: ticket.time_start,
                                                            endDate: ticket.date_end,
                                                            endTime: ticket.time_end,
                                                            zone: event.timezone,
                                                        })}
                                                    </span>
                                                </div>

                                                <div>
                                                    Maks/order:{" "}
                                                    <span className="font-medium">
                                                        {ticket.max_per_order} tiket
                                                    </span>
                                                </div>

                                                <p className="prose prose-sm max-w-none
                                                            prose-ol:list-decimal
                                                            prose-ul:list-disc
                                                            prose-li:ml-4"
                                                    dangerouslySetInnerHTML={{ __html: ticket.deskripsi }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-right min-w-[140px]">
                                            <div className="text-xs text-slate-500">Harga</div>
                                            <div className="text-lg font-bold">
                                                Rp {Number(ticket.price).toLocaleString("id-ID")}
                                            </div>

                                            <div className="text-xs mt-2">
                                                Terjual: <b>{sold}</b>
                                            </div>
                                            <div className="text-xs">
                                                Sisa:{" "}
                                                <b className={remaining === 0 ? "text-red-600" : ""}>
                                                    {remaining}
                                                </b>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* end detail event */}
        </>
    );
}

/* ======= SMALL UI HELPERS ======= */
function StatusBadge({ status }) {
    const MAP = {
        draft: "bg-slate-100 text-slate-700",
        available: "bg-green-100 text-green-700",
        closed: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-2 py-0.5 text-xs rounded capitalize
        ${MAP[status] || "bg-slate-100 text-slate-700"}
      `}
        >
            {status}
        </span>
    );
}


function Info({ label, children }) {
    return (
        <div>
            <div className="text-slate-500">{label}</div>
            <div className="font-medium">{children}</div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <div className="text-slate-500 mb-1">{title}</div>
            <div className="text-slate-700">{children}</div>
        </div>
    );
}
