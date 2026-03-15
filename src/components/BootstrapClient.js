"use client"

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // This will load bootstrap JS only in the client side
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
