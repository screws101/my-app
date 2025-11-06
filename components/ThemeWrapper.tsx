"use client";

import { useEffect } from "react";
import { useMode } from "../context/ModeContext";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('theme', mode);
    }
  }, [mode]);

  return <>{children}</>;
}

