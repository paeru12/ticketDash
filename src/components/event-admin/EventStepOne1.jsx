import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TagInput from "../ui/tagsinput";

export default function EventStepOne({
  data,
  onChange,
  onNext,
  onCancel,
}) {
  const [showError, setShowError] = useState(false);
  const [tags, setTag] = useState([]);

  const nameRef = useRef(null);
  const vendorRef = useRef(null);

  function handleNext() {
    if (!data.name || !data.vendor) {
      setShowError(true);
      (!data.name ? nameRef : vendorRef).current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    onNext();
  }

  return (
    <div className="space-y-6">
      {showError && (
        <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-700 rounded">
          Lengkapi semua field wajib 
        </div>
      )}

      <h2 className="text-lg font-semibold">
        Step 1 – Organizer
      </h2>

      <div ref={nameRef}>
        <label className="text-sm font-medium">
          Nama Organizer <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.name}
          onChange={(e) =>
            onChange({ ...data, name: e.target.value })
          }
          className={showError && !data.name ? "border-red-400" : ""}
        />
      </div>

      <div ref={vendorRef}>
        <label className="text-sm font-medium">
          Vendor <span className="text-red-500">*</span>
        </label>
        <Input
          value={data.vendor}
          onChange={(e) =>
            onChange({ ...data, vendor: e.target.value })
          }
          className={showError && !data.vendor ? "border-red-400" : ""}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Catatan</label>
        <Input
          value={data.note}
          onChange={(e) =>
            onChange({ ...data, note: e.target.value })
          }
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
