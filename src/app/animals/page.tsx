"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { animals, searchAnimals, getAnimalsByTag, getAnimalsByClass } from "@/data/animals";
import { AnimalCard } from "@/components/AnimalCard";
import { AnimalClass, Habitat, ThemeTag } from "@/types/animal";
import { Suspense } from "react";

const classOptions: { key: AnimalClass; label: string }[] = [
  { key: "ほにゅうるい", label: "ほにゅうるい" },
  { key: "とり", label: "とり" },
  { key: "さかな", label: "さかな" },
  { key: "はちゅうるい", label: "はちゅうるい" },
  { key: "りょうせいるい", label: "りょうせいるい" },
  { key: "こんちゅう", label: "こんちゅう" },
  { key: "うみのいきもの", label: "うみのいきもの" },
];

const tagOptions: { key: ThemeTag; label: string; emoji: string }[] = [
  { key: "つよい", label: "つよい", emoji: "💪" },
  { key: "はやい", label: "はやい", emoji: "⚡" },
  { key: "おおきい", label: "おおきい", emoji: "🏔️" },
  { key: "かわいい", label: "かわいい", emoji: "🩷" },
  { key: "へん", label: "へん", emoji: "🤪" },
  { key: "こわい", label: "こわい", emoji: "😱" },
];

function AnimalListContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag") as ThemeTag | null;
  const initialHabitat = searchParams.get("habitat") as Habitat | null;

  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<AnimalClass | null>(null);
  const [selectedTag, setSelectedTag] = useState<ThemeTag | null>(initialTag);
  const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(initialHabitat);

  const filteredAnimals = useMemo(() => {
    let result = animals;

    if (query) {
      result = searchAnimals(query);
    }
    if (selectedClass) {
      result = result.filter((a) => a.classificationClass === selectedClass);
    }
    if (selectedTag) {
      result = result.filter((a) => a.tags.includes(selectedTag));
    }
    if (selectedHabitat) {
      result = result.filter((a) => a.habitat === selectedHabitat || a.habitat.includes(selectedHabitat.replace("りく", "りく").replace("うみ", "うみ").replace("そら", "そら")));
    }

    return result.sort((a, b) => a.popularityRank - b.popularityRank);
  }, [query, selectedClass, selectedTag, selectedHabitat]);

  const clearFilters = () => {
    setQuery("");
    setSelectedClass(null);
    setSelectedTag(null);
    setSelectedHabitat(null);
  };

  const hasFilters = query || selectedClass || selectedTag || selectedHabitat;

  return (
    <main className="pb-12">
      {/* ヘッダー */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl p-1 active:scale-90 transition-transform"
            >
              ←
            </Link>
            <h1 className="text-xl font-bold text-gray-800">
              どうぶつ いちらん
            </h1>
          </div>

          {/* 検索 */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="なまえで さがす..."
            className="mt-3 w-full bg-gray-50 rounded-xl px-4 py-3 text-base
                       border-2 border-transparent focus:border-[#4A7C28] focus:bg-white
                       outline-none transition-colors"
          />
        </div>

        {/* フィルタ */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {tagOptions.map((t) => (
            <button
              key={t.key}
              onClick={() =>
                setSelectedTag(selectedTag === t.key ? null : t.key)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  selectedTag === t.key
                    ? "bg-[#4A7C28] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {classOptions.map((c) => (
            <button
              key={c.key}
              onClick={() =>
                setSelectedClass(selectedClass === c.key ? null : c.key)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${
                  selectedClass === c.key
                    ? "bg-[#1A6B8A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <div className="px-4 pb-3">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              ✕ フィルターを クリア
            </button>
          </div>
        )}
      </div>

      {/* 結果 */}
      <div className="px-4 mt-4">
        <p className="text-sm text-gray-400 mb-3 px-1">
          {filteredAnimals.length}しゅるい の どうぶつ
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
        {filteredAnimals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-400 text-base">
              みつからなかったよ
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AnimalsPage() {
  return (
    <Suspense>
      <AnimalListContent />
    </Suspense>
  );
}
