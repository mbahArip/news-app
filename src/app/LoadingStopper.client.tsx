"use client";

import NProgress from "nprogress";
import { useEffect } from "react";

export default function LoadingStopper() {
  useEffect(() => {
    NProgress.done();
  }, []);

  return null;
}
