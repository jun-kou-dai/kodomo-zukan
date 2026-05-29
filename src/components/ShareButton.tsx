"use client";

import { useState } from "react";

export function ShareButton({
  animalName,
  secret,
}: {
  animalName: string;
  secret: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${animalName}の ひみつ🤫 ${secret}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${animalName} | こども動物図鑑`, text, url });
        return;
      } catch {
        return;
      }
    }

    const shareText = `${text}\n${url}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では手動コピー用に提示（無反応を防ぐ）
      window.prompt("このリンクを コピーして シェアしてね", shareText);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-left
                 bg-white border-2 border-gray-100 hover:border-sky-200 shadow-sm
                 transition-all duration-200 active:scale-95"
    >
      <span className="text-3xl">{copied ? "✅" : "🗣️"}</span>
      <div>
        <p className="font-bold text-base text-gray-800">
          {copied ? "コピーしたよ！" : `${animalName}の ことを おしえる`}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">おともだちや かぞくに シェア</p>
      </div>
    </button>
  );
}
