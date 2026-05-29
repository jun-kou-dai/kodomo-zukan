"use client";

import { useEffect } from "react";

const basePath = process.env.NODE_ENV === "production" ? "/kodomo-zukan" : "";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
        // 登録失敗はオフライン非対応になるだけなので握りつぶしてよい
      });
    }
  }, []);

  return null;
}
