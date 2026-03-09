"use client";

import { useRef, useState } from "react";
import { AnimalSound } from "@/types/animal";

export function SoundButton({
  sound,
  animalName,
}: {
  sound: AnimalSound;
  animalName: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={sound.url}
        preload="none"
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={handlePlay}
        className={`
          flex items-center gap-3 w-full px-5 py-4 rounded-2xl text-left
          transition-all duration-200 active:scale-95
          ${
            isPlaying
              ? "bg-amber-100 border-2 border-amber-400 shadow-md"
              : "bg-white border-2 border-gray-100 hover:border-amber-200 shadow-sm"
          }
        `}
      >
        <span className={`text-3xl ${isPlaying ? "animate-bounce" : ""}`}>
          {isPlaying ? "🔊" : "🔈"}
        </span>
        <div>
          <p className="font-bold text-base text-gray-800">
            {animalName}の こえを きく
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {sound.sourceName} / {sound.licenseName}
          </p>
        </div>
      </button>
    </>
  );
}
