import React from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ INI YANG HILANG
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  function handleBack() {
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={handleBack} className="gap-2 inline-flex items-center">
          <Home className="h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );
}
