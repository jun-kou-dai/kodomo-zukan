"use client";

import { useRef, useState } from "react";
import { AnimalSound, AnimalVideo } from "@/types/animal";

export function MediaButtons({
  sound,
  video,
  animalName,
}: {
  sound?: AnimalSound;
  video?: AnimalVideo;
  animalName: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  if (!sound && !video) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {sound && (
          <button
            onClick={toggleSound}
            aria-label={`${animalName}の こえを きく`}
            className={`
              relative flex flex-col items-center justify-center gap-2 py-7 rounded-3xl
              text-white shadow-lg active:scale-95 transition-transform duration-150
              bg-gradient-to-br from-amber-400 to-orange-500
              ${isPlaying ? "ring-4 ring-amber-200" : ""}
            `}
          >
            <span
              className={`text-5xl drop-shadow ${isPlaying ? "animate-bounce" : ""}`}
            >
              {isPlaying ? "🔊" : "🔈"}
            </span>
            <span className="text-base font-extrabold drop-shadow-sm">
              {isPlaying ? "とめる" : "こえを きく"}
            </span>
          </button>
        )}

        {video && (
          <button
            onClick={() => setVideoOpen(true)}
            aria-label={`${animalName}の うごく すがたを みる`}
            className="
              relative flex flex-col items-center justify-center gap-2 py-7 rounded-3xl
              text-white shadow-lg active:scale-95 transition-transform duration-150
              bg-gradient-to-br from-sky-400 to-indigo-500
            "
          >
            <span className="text-5xl drop-shadow">🎥</span>
            <span className="text-base font-extrabold drop-shadow-sm">
              うごく すがた
            </span>
          </button>
        )}
      </div>

      {video && videoOpen && (
        <div className="rounded-2xl overflow-hidden shadow-md bg-black">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`${video.embedUrl}?rel=0&modestbranding=1&autoplay=1`}
              title={`${animalName}の動画`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {sound && (
        <audio
          ref={audioRef}
          src={sound.url}
          preload="none"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* 出典表記（CC BY 順守のため小さく残す） */}
      <p className="text-[11px] text-gray-300 text-center leading-relaxed">
        {sound && `こえ: ${sound.sourceName} / ${sound.licenseName}`}
        {sound && video && "　"}
        {video && "どうが: YouTube"}
      </p>
    </div>
  );
}
