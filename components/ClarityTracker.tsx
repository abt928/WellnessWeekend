"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityTracker() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId) {
      try {
        Clarity.init(projectId);
      } catch (e) {
        console.warn("[Clarity] Initialization failed:", e);
      }
    }
  }, []);

  return null;
}
