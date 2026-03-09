"use client";

import { useState } from "react";
import { AnimalVideo } from "@/types/animal";

export function VideoPlayer({
  video,
  animalName,
}: {
  video: AnimalVideo;
  animalName: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="w-full bg-white border-2 border-gray-100 hover:border-sky-200 rounded-2xl shadow-sm
                   flex items-center gap-3 px-5 py-4 transition-all duration-200 active:scale-95"
      >
        <span className="text-3xl">🎬</span>
        <div className="text-left">
          <p className="font-bold text-base text-gray-800">
            {animalName}の どうがを みる
          </p>
          <p className="text-xs text-gray-400 mt-0.5">YouTube</p>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-black">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`${video.embedUrl}?rel=0&modestbranding=1`}
          title={`${animalName}の動画`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
