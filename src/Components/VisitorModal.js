"use client";

import { useState, useEffect } from "react";
import VisitorForm from "./VisitorForm";

export default function VisitorModal() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage status
    const submitted = localStorage.getItem("visitorFormSubmitted");
    const cancelledTime = localStorage.getItem("visitorFormCancelled");

    // If already submitted, never show again
    if (submitted) {
      setIsLoading(false);
      return;
    }

    // If cancelled within last minute, don't show
    if (cancelledTime) {
      const timeDiff = Date.now() - parseInt(cancelledTime);
      if (timeDiff < 60000) { // 1 minute = 60000ms
        setIsLoading(false);
        // Still within cooldown period, don't show
        return;
      } else {
        // Cooldown period expired, remove the flag
        localStorage.removeItem("visitorFormCancelled");
      }
    }

    // Show form after 5 seconds delay on first visit
    const timer = setTimeout(() => {
      setShowForm(true);
      setIsLoading(false);
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    // Store the cancellation time
    localStorage.setItem("visitorFormCancelled", Date.now().toString());
    setShowForm(false);
  };

  const handleSubmit = () => {
    // Mark as submitted so it never shows again
    localStorage.setItem("visitorFormSubmitted", "true");
    setShowForm(false);
  };

  if (!showForm && isLoading) {
    // Optional: Show a subtle loading indicator
    return null;
  }

  if (!showForm) return null;

  return <VisitorForm onClose={handleClose} onSubmit={handleSubmit} />;
}

// "use client";

// import { useState, useEffect } from "react";
// import VisitorForm from "./VisitorForm";

// export default function VisitorModal() {
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     const submitted = localStorage.getItem("visitorFormSubmitted");
//     const cancelledTime = localStorage.getItem("visitorFormCancelled");

//     if (submitted) {
//       // Already submitted, don't show
//       return;
//     }

//     if (cancelledTime) {
//       const timeDiff = Date.now() - parseInt(cancelledTime);
//       if (timeDiff < 60000) { // 1 minute
//         // Still within 1 minute, don't show yet
//         const remaining = 60000 - timeDiff;
//         setTimeout(() => {
//           setShowForm(true);
//         }, remaining);
//         return;
//       } else {
//         // Time passed, remove the cancelled flag
//         localStorage.removeItem("visitorFormCancelled");
//       }
//     }

//     // Show the form immediately
//     setShowForm(true);
//   }, []);

//   const handleClose = () => {
//     setShowForm(false);
//   };

//   if (!showForm) return null;

//   return <VisitorForm onClose={handleClose} />;
// }