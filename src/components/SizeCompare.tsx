"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "childHeightCm";
const DEFAULT_HEIGHT = 110;
const EVENT = "child-height-change";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getHeight() {
  const n = Number(localStorage.getItem(STORAGE_KEY));
  return n >= 50 && n <= 200 ? n : DEFAULT_HEIGHT;
}

export function SizeCompare({
  animalName,
  animalHeightCm,
  photoUrl,
}: {
  animalName: string;
  animalHeightCm: number;
  photoUrl?: string;
}) {
  const heightCm = useSyncExternalStore(
    subscribe,
    getHeight,
    () => DEFAULT_HEIGHT
  );

  const changeHeight = () => {
    const input = window.prompt(
      "きみの しんちょうは なんセンチ？",
      String(heightCm)
    );
    if (input === null) return;
    const n = Math.round(Number(input));
    if (n >= 50 && n <= 200) {
      localStorage.setItem(STORAGE_KEY, String(n));
      window.dispatchEvent(new Event(EVENT));
    }
  };

  const ratio = animalHeightCm / heightCm;
  const ratioText = ratio >= 10 ? Math.round(ratio) : Math.round(ratio * 10) / 10;
  const childCount = Math.max(1, Math.min(8, Math.round(ratio)));

  return (
    <section className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-100">
      <h2 className="text-base font-bold text-emerald-700 mb-1">
        📏 きみと くらべて
      </h2>
      <p className="text-2xl font-extrabold text-emerald-900 leading-snug mb-4">
        {animalName}は きみ{" "}
        <span className="text-emerald-600">やく {ratioText}にんぶん</span>{" "}
        の たかさ！
      </p>

      <div className="flex items-end justify-center gap-6">
        {/* 動物 */}
        <div className="flex flex-col items-center">
          {photoUrl ? (
            <div className="relative w-24 h-40 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={photoUrl}
                alt={animalName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="w-24 h-40 rounded-2xl bg-emerald-200" />
          )}
          <p className="text-sm font-bold text-emerald-800 mt-1">{animalName}</p>
          <p className="text-xs text-emerald-500">{animalHeightCm}cm</p>
        </div>

        {/* きみ（積み重ね） */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col-reverse items-center leading-none">
            {Array.from({ length: childCount }).map((_, i) => (
              <span key={i} className="text-2xl -my-0.5">
                🧒
              </span>
            ))}
          </div>
          <p className="text-sm font-bold text-gray-700 mt-1">きみ</p>
          <p className="text-xs text-gray-400">{heightCm}cm</p>
        </div>
      </div>

      <button
        onClick={changeHeight}
        className="mt-4 w-full text-center text-sm font-bold text-emerald-700
                   bg-white/70 rounded-xl py-2.5 active:scale-95 transition-transform"
      >
        📐 きみの しんちょうを かえる（いまは {heightCm}cm）
      </button>
    </section>
  );
}
