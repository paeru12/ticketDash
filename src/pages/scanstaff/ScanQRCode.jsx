import { useEffect, useRef } from "react";

export default function ScanTicket() {
  const ref = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode";
    script.async = true;
    script.onload = () => {
      const qr = new window.Html5Qrcode("qr-reader");
      qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (text) => {
          console.log("QR:", text);
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  return <div id="qr-reader" className="w-full max-w-md mx-auto" />;
}
