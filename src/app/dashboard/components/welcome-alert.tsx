"use client";

import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function WelcomeAlert() {
  const [showAlert, setShowAlert] = useState(true);

  // Load alert state from localStorage on mount
  useEffect(() => {
    const alertDismissed = localStorage.getItem("welcomeAlertDismissed");
    if (alertDismissed) {
      setShowAlert(false);
    }
  }, []);

  const handleDismiss = () => {
    setShowAlert(false);
    localStorage.setItem("welcomeAlertDismissed", "true");
  };

  if (!showAlert) return null;

  return (
    <Alert className="w-full rounded-none border-x-0 border-t-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Velkommen til ditt nye dashboard! Her kan du administrere alle dine
            opptak.
          </AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
