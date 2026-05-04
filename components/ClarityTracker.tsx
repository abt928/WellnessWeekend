"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wlnikp7pcm";

export default function ClarityTracker() {
  useEffect(() => {
    try {
      Clarity.init(CLARITY_PROJECT_ID);
    } catch (e) {
      console.warn("[Clarity] Initialization failed:", e);
    }
  }, []);

  return null;
}
