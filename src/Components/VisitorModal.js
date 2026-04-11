"use client";

import { useState, useEffect } from "react";
import VisitorForm from "./VisitorForm";

export default function VisitorModal() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem("visitorFormSubmitted");
    const cancelledTime = localStorage.getItem("visitorFormCancelled");

    if (submitted) {
      // Already submitted, don't show
      return;
    }

    if (cancelledTime) {
      const timeDiff = Date.now() - parseInt(cancelledTime);
      if (timeDiff < 60000) { // 1 minute
        // Still within 1 minute, don't show yet
        const remaining = 60000 - timeDiff;
        setTimeout(() => {
          setShowForm(true);
        }, remaining);
        return;
      } else {
        // Time passed, remove the cancelled flag
        localStorage.removeItem("visitorFormCancelled");
      }
    }

    // Show the form immediately
    setShowForm(true);
  }, []);

  const handleClose = () => {
    setShowForm(false);
  };

  if (!showForm) return null;

  return <VisitorForm onClose={handleClose} />;
}