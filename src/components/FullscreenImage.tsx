"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface FullscreenImageProps {
  src: string;
  alt: string;
  attribution?: string;
  licenseName?: string;
  sourceName?: string;
}

export function FullscreenImage({
  src,
  alt,
  attribution,
  licenseName,
  sourceName,
}: FullscreenImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // ESCキーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    // スクロールを無効化
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* 全画面ボタン */}
      <button
        onClick={open}
        aria-label="写真を大きく見る"
        className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white
                   w-10 h-10 rounded-full flex items-center justify-center
                   active:scale-90 transition-transform text-lg z-10"
      >
        🔍
      </button>

      {/* フルスクリーンモーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          onClick={close}
        >
          {/* 閉じるボタン */}
          <button
            onClick={close}
            aria-label="閉じる"
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white
                       w-12 h-12 rounded-full flex items-center justify-center
                       active:scale-90 transition-transform text-2xl z-50"
          >
            ✕
          </button>

          {/* 画像 - タップで閉じないようにイベント伝播を止める */}
          <div
            className="relative w-full flex-1 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain p-2"
              sizes="100vw"
              priority
            />
          </div>

          {/* 動物名・クレジット */}
          <div className="shrink-0 py-3 px-4 text-center">
            <p className="text-white text-lg font-bold mb-1">
              {alt}
            </p>
            {attribution && (
              <p className="text-white/50 text-xs">
                📷 {attribution}
                {licenseName && ` / ${licenseName}`}
                {sourceName && ` (${sourceName})`}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
