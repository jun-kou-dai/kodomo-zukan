"use client";

import Image from "next/image";
import Link from "next/link";
import { Animal } from "@/types/animal";
import { TagBadge } from "./TagBadge";

export function AnimalCard({ animal }: { animal: Animal }) {
  const primaryImage = animal.images.find((img) => img.isPrimary);
  const imageUrl = primaryImage?.url;

  return (
    <Link href={`/animals/${animal.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg active:scale-[0.97] transition-all duration-200">
        {/* 写真が主役 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 animate-pulse">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={animal.japaneseName}
              fill
              className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={(e) => {
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.classList.remove("animate-pulse", "bg-gray-100");
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">🦁</span>
            </div>
          )}

          {/* 音・動画アイコン */}
          <div className="absolute top-2 right-2 flex gap-1">
            {animal.sounds.length > 0 && (
              <span className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-sm">
                🔊
              </span>
            )}
            {animal.videos.length > 0 && (
              <span className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-sm">
                🎬
              </span>
            )}
          </div>
        </div>

        {/* 名前とタグ */}
        <div className="p-3">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">
            {animal.japaneseName}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{animal.kanaName}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {animal.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
