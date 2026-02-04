import { Button } from "@/components/ui/button";
import EventUpdateDialog from "./EventUpdateDialog";
import TicketUpdateDialog from "./TicketUpdateDialog";
import EventDetailDialog from "./EventDetailDialog";
import ModalWrapper from "@/components/common/ModalWrapper";

export default function EventActionDialog({
  open,
  mode,
  data,
  onClose,
  onSuccess,
}) {
  if (!open || !data) return null;

  return (
    <ModalWrapper onClose={onClose}>
      {mode === "update-event" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">
          {/* MODAL */}
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-4 border-b flex inline-block justify-between items-center">
              <h2 className="text-lg font-semibold capitalize">
                Update Event
              </h2>
               <Button variant="outline" onClick={onClose}>
                X
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EventUpdateDialog
                event={data}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        </div>

      )}

      {mode === "update-ticket" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">
          {/* MODAL */}
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-4 border-b flex inline-block justify-between items-center">
              <h2 className="text-lg font-semibold capitalize">
                Update Ticket
              </h2>
              <Button variant="outline" onClick={onClose}>
                X
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TicketUpdateDialog
                event={data}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </div>
          </div>
        </div>

      )}

      {mode === "detail" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6">
          {/* MODAL */}
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-4 border-b flex inline-block justify-between items-center">
              <h2 className="text-lg font-semibold capitalize">
                {mode === "detail" && data.name}
              </h2>
              <Button variant="outline" onClick={onClose}>
                X
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <EventDetailDialog
                event={data}
                onClose={onClose}
              />
            </div>

          </div>
        </div>
      )}
    </ModalWrapper>
  );

}

