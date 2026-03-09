"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { animals, getAnimalById } from "@/data/animals";
import { Animal } from "@/types/animal";
import { Suspense } from "react";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialA = searchParams.get("a") || "";
  const initialB = searchParams.get("b") || "";

  const [animalAId, setAnimalAId] = useState(initialA);
  const [animalBId, setAnimalBId] = useState(initialB);

  const animalA = animalAId ? getAnimalById(animalAId) : null;
  const animalB = animalBId ? getAnimalById(animalBId) : null;

  return (
    <main className="pb-12">
      {/* ヘッダー */}
      <div className="bg-white px-4 pt-4 pb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl p-1 active:scale-90 transition-transform"
          >
            ←
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            ⚖️ くらべる
          </h1>
        </div>
      </div>

      {/* 選択エリア */}
      <div className="px-4 mt-4 flex gap-3">
        <AnimalSelector
          value={animalAId}
          onChange={setAnimalAId}
          exclude={animalBId}
          label="ひだり"
        />
        <div className="flex items-center">
          <span className="text-xl font-bold text-amber-400">VS</span>
        </div>
        <AnimalSelector
          value={animalBId}
          onChange={setAnimalBId}
          exclude={animalAId}
          label="みぎ"
        />
      </div>

      {/* 比較結果 */}
      {animalA && animalB && (
        <div className="px-4 mt-6 space-y-4">
          {/* 写真比較 */}
          <div className="flex gap-2 rounded-2xl overflow-hidden shadow-md">
            <div className="flex-1 relative h-40">
              {animalA.images[0] && (
                <Image
                  src={animalA.images[0].url}
                  alt={animalA.japaneseName}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white font-bold text-center">
                  {animalA.japaneseName}
                </p>
              </div>
            </div>
            <div className="flex-1 relative h-40">
              {animalB.images[0] && (
                <Image
                  src={animalB.images[0].url}
                  alt={animalB.japaneseName}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white font-bold text-center">
                  {animalB.japaneseName}
                </p>
              </div>
            </div>
          </div>

          {/* 項目比較 */}
          <CompareRow
            label="📏 おおきさ"
            a={animalA.sizeText}
            b={animalB.sizeText}
          />
          <CompareRow
            label="⚡ はやさ"
            a={animalA.speedText}
            b={animalB.speedText}
          />
          <CompareRow
            label="⚖️ おもさ"
            a={animalA.weightText}
            b={animalB.weightText}
          />
          <CompareRow
            label="🍽️ たべもの"
            a={animalA.dietText}
            b={animalB.dietText}
          />
          <CompareRow
            label="🌍 すむところ"
            a={animalA.habitatText}
            b={animalB.habitatText}
          />
          <CompareRow
            label="⏳ じゅみょう"
            a={animalA.lifespanText}
            b={animalB.lifespanText}
          />

          {/* 子ども向け比較文 */}
          <section className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-100">
            <h3 className="text-base font-bold text-amber-700 mb-2">
              💡 くらべて わかること
            </h3>
            <p className="text-base leading-relaxed text-amber-900">
              {generateComparisonText(animalA, animalB)}
            </p>
          </section>
        </div>
      )}

      {(!animalA || !animalB) && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">⚖️</p>
          <p className="text-gray-400 text-base">
            2ひき えらんで くらべよう！
          </p>
        </div>
      )}
    </main>
  );
}

function AnimalSelector({
  value,
  onChange,
  exclude,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  exclude: string;
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-white rounded-xl px-3 py-3 text-base font-medium
                 border-2 border-gray-100 focus:border-[#4A7C28] outline-none
                 appearance-none cursor-pointer"
    >
      <option value="">えらぶ</option>
      {animals
        .filter((a) => a.id !== exclude)
        .map((a) => (
          <option key={a.id} value={a.id}>
            {a.japaneseName}
          </option>
        ))}
    </select>
  );
}

function CompareRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-sm font-bold text-gray-500 mb-2 text-center">
        {label}
      </p>
      <div className="flex gap-3">
        <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-700">{a}</p>
        </div>
        <div className="flex-1 bg-rose-50 rounded-xl p-3 text-center">
          <p className="text-sm text-gray-700">{b}</p>
        </div>
      </div>
    </div>
  );
}

function generateComparisonText(a: Animal, b: Animal): string {
  const texts: string[] = [];

  // 大きさ比較
  const sizeA = parseFloat(a.sizeText.replace(/[^\d.]/g, "")) || 0;
  const sizeB = parseFloat(b.sizeText.replace(/[^\d.]/g, "")) || 0;
  if (sizeA && sizeB) {
    if (sizeA > sizeB * 2) {
      texts.push(
        `${a.japaneseName}は ${b.japaneseName}より ずっと おおきいよ！`
      );
    } else if (sizeB > sizeA * 2) {
      texts.push(
        `${b.japaneseName}は ${a.japaneseName}より ずっと おおきいよ！`
      );
    } else if (sizeA > sizeB) {
      texts.push(
        `${a.japaneseName}の ほうが すこし おおきいよ。`
      );
    } else if (sizeB > sizeA) {
      texts.push(
        `${b.japaneseName}の ほうが すこし おおきいよ。`
      );
    }
  }

  // 速さ比較
  const speedA = parseFloat(a.speedText.replace(/[^\d.]/g, "")) || 0;
  const speedB = parseFloat(b.speedText.replace(/[^\d.]/g, "")) || 0;
  if (speedA && speedB) {
    if (speedA > speedB) {
      texts.push(
        `はやさは ${a.japaneseName}の かち！`
      );
    } else if (speedB > speedA) {
      texts.push(
        `はやさは ${b.japaneseName}の かち！`
      );
    }
  }

  // 食べ物
  if (a.dietText !== b.dietText) {
    texts.push(
      `${a.japaneseName}は ${a.dietText.slice(0, 15)}を たべるけど、${b.japaneseName}は ${b.dietText.slice(0, 15)}を たべるよ。`
    );
  }

  if (texts.length === 0) {
    texts.push(
      `${a.japaneseName}と ${b.japaneseName}は それぞれ ちがう とくちょうが あるね！`
    );
  }

  return texts.join(" ");
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
