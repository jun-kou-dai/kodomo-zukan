"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { animals } from "@/data/animals";
import type { Animal } from "@/types/animal";

function getTodayAnimal(): Animal {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return animals[dayOfYear % animals.length];
}

export function TodayAnimal() {
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    setAnimal(getTodayAnimal());
  }, []);

  if (!animal) {
    return (
      <section className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
          📅 きょうの どうぶつ
        </h2>
        <div className="rounded-2xl overflow-hidden shadow-md h-72 bg-gray-100 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
        📅 きょうの どうぶつ
      </h2>
      <Link href={`/animals/${animal.id}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-md h-72">
          {animal.images[0] && (
            <Image
              src={animal.images[0].url}
              alt={animal.japaneseName}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-white text-2xl font-bold">
              {animal.japaneseName}
            </p>
            <p className="text-white/80 text-sm mt-1 line-clamp-1">
              {animal.childSummary}
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
