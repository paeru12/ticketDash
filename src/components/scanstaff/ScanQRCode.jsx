import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ScanTicket({ eventData, onBack }) {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();

  // Use props if available, otherwise implementation for route-based access
  const state = eventData || locationState;

  // Custom navigation handler: if onBack prop exists (embedded mode), use it.
  // Otherwise use navigate (route mode).
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/select-event");
    }
  };

  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);

  // If no state, redirect (or show error) - Only if NOT in embedded mode
  useEffect(() => {
    if (!state?.eventId && !eventData) {
      toast.error("Silakan pilih event terlebih dahulu");
      navigate("/select-event");
    }
  }, [state, navigate, eventData]);

  useEffect(() => {
    if (!state?.eventId) return;

    // Load script dynamically
    const scriptId = "html5-qrcode-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/html5-qrcode";
      script.async = true;
      document.body.appendChild(script);
    }

    const onScriptLoad = () => {
      if (!window.Html5Qrcode) return;

      const qrCodeId = "reader";

      // Cleanup previous instance if any (though usually handled by unmount)
      // We use a slight delay to ensure DOM is ready
      setTimeout(() => {
        if (!document.getElementById(qrCodeId)) return;

        const html5QrCode = new window.Html5Qrcode(qrCodeId);
        scannerRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            // Success callback
            console.log("QR Code detected:", decodedText);
            handleScanSuccess(decodedText, html5QrCode);
          },
          (errorMessage) => {
            // Error callback (ignore for now as it triggers on every frame without QR)
          }
        ).catch(err => {
          console.error("Error starting scanner:", err);
          toast.error("Gagal memulai kamera");
        });
      }, 500);
    };

    if (window.Html5Qrcode) {
      onScriptLoad();
    } else {
      script.addEventListener("load", onScriptLoad);
    }

    return () => {
      // Cleanup
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch(err => console.error("Failed to stop scanner", err));
      }
      if (script) {
        script.removeEventListener("load", onScriptLoad);
      }
    };
  }, [state]);

  const handleScanSuccess = (decodedText, scanner) => {
    // Prevent multiple toasts if scanning is fast
    // Ideally we might pause scanning or debounce
    scanner.pause();
    toast.success(`Berhasil: ${decodedText}`);

    // Resume after 2 seconds
    setTimeout(() => {
      scanner.resume();
    }, 2000);
  };

  if (!state?.eventId) return null;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center min-h-[80vh]">
      {/* HEADER */}
      <div className="w-full mb-6 text-center space-y-1">
        <h2 className="text-2xl font-bold">{state.eventName}</h2>
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {state.gateName} (ID: {state.gateId})
        </div>
      </div>

      {/* SCANNER AREA */}
      <div className="w-full bg-muted rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 relative">
        <div id="reader" className="w-full h-full"></div>
        {/* Helper text overlay if needed, or just let the scanner handle it */}
      </div>

      <p className="mt-4 text-muted-foreground text-sm text-center">
        Arahkan kamera ke QR Code tiket pengunjung
      </p>

      {/* Manual Action or Back */}
      <div className="mt-8 w-full">
        <Button variant="outline" className="w-full" onClick={handleBack}>
          Ganti Event / Gate
        </Button>
      </div>
    </div>
  );
}
