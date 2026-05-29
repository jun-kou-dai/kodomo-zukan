"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animals } from "@/data/animals";
import { Animal } from "@/types/animal";

type AxisKey = "strong" | "speed" | "weight" | "size" | "life";

type Axis = {
  key: AxisKey;
  label: string;
  emoji: string;
  color: string; // ピル/ヘッダーのグラデーション
  ring: string; // 1位カードのふちどり
  value: (a: Animal) => number | undefined;
  format: (v: number) => string;
  topPhrase: string; // 1位の ひとこと
};

function fmtSpeed(v: number): string {
  if (v < 1) return `じそく ${v}キロ`;
  return `じそく ${Math.round(v)}キロ`;
}
function fmtWeight(kg: number): string {
  if (kg >= 1000) {
    const t = kg / 1000;
    return `${Number.isInteger(t) ? t : t.toFixed(1)}トン`;
  }
  if (kg < 1) return `${Math.round(kg * 1000)}グラム`;
  return `${Number.isInteger(kg) ? kg : kg.toFixed(1)}キロ`;
}
function fmtSize(cm: number): string {
  if (cm >= 100) {
    const m = cm / 100;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}メートル`;
  }
  if (cm < 1) return `${Math.round(cm * 10)}ミリ`;
  return `${Number.isInteger(cm) ? cm : cm.toFixed(1)}センチ`;
}
function fmtLife(y: number): string {
  return `${y}ねん`;
}

const AXES: Axis[] = [
  {
    key: "strong",
    label: "つよい",
    emoji: "💪",
    color: "from-red-400 to-rose-500",
    ring: "ring-red-300",
    value: (a) => a.biteForcePsi,
    format: (v) => `かむ力 ${v}`,
    topPhrase: "どうぶつの なかで いちばん つよい！",
  },
  {
    key: "speed",
    label: "はやい",
    emoji: "⚡",
    color: "from-amber-400 to-yellow-500",
    ring: "ring-amber-300",
    value: (a) => a.speedKmh,
    format: fmtSpeed,
    topPhrase: "どうぶつの なかで いちばん はやい！",
  },
  {
    key: "weight",
    label: "おもい",
    emoji: "🏋️",
    color: "from-slate-500 to-gray-700",
    ring: "ring-slate-300",
    value: (a) => a.weightKg,
    format: fmtWeight,
    topPhrase: "どうぶつの なかで いちばん おもい！",
  },
  {
    key: "size",
    label: "おおきい",
    emoji: "🏔️",
    color: "from-violet-400 to-purple-500",
    ring: "ring-violet-300",
    value: (a) => a.sizeCm,
    format: fmtSize,
    topPhrase: "どうぶつの なかで いちばん おおきい！",
  },
  {
    key: "life",
    label: "ながいき",
    emoji: "⏳",
    color: "from-teal-400 to-emerald-500",
    ring: "ring-emerald-300",
    value: (a) => a.lifespanYears,
    format: fmtLife,
    topPhrase: "どうぶつの なかで いちばん ながいき！",
  },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function rank(axis: Axis): { animal: Animal; v: number }[] {
  return animals
    .map((a) => ({ animal: a, v: axis.value(a) }))
    .filter((x): x is { animal: Animal; v: number } => typeof x.v === "number")
    .sort((a, b) => b.v - a.v);
}

export default function RankingPage() {
  const [axisKey, setAxisKey] = useState<AxisKey>("strong");
  const axis = AXES.find((a) => a.key === axisKey)!;
  const ranked = rank(axis);
  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3, 10);

  return (
    <main className="pb-16">
      {/* ヘッダー */}
      <section
        className={`bg-gradient-to-br ${axis.color} text-white px-6 pt-8 pb-7 rounded-b-[2rem] transition-colors`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-2xl p-1 active:scale-90 transition-transform"
          >
            ←
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">
            🏆 どうぶつ いちばん
          </h1>
        </div>
        <p className="text-sm mt-2 text-white/90">
          どの どうぶつが いちばんか みてみよう！
        </p>
      </section>

      {/* 軸えらび */}
      <div className="px-4 mt-4 grid grid-cols-5 gap-1.5">
        {AXES.map((a) => (
          <button
            key={a.key}
            onClick={() => setAxisKey(a.key)}
            className={`rounded-2xl py-2.5 text-center font-bold transition-all active:scale-95
              ${
                a.key === axisKey
                  ? `bg-gradient-to-br ${a.color} text-white shadow-md`
                  : "bg-white text-gray-500 shadow-sm"
              }`}
          >
            <span className="text-xl block">{a.emoji}</span>
            <span className="text-xs mt-0.5 block">{a.label}</span>
          </button>
        ))}
      </div>

      {/* トップ3（主役。大きく カッコよく） */}
      <section className="px-4 mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        {top3.map((x, i) => {
          const style = [
            {
              h: "h-72",
              ring: "ring-4 ring-amber-300",
              name: "text-3xl",
              val: "text-3xl",
            },
            {
              h: "h-56",
              ring: "ring-2 ring-slate-300",
              name: "text-2xl",
              val: "text-2xl",
            },
            {
              h: "h-52",
              ring: "ring-2 ring-orange-300",
              name: "text-2xl",
              val: "text-2xl",
            },
          ][i];
          return (
            <Link
              key={x.animal.id}
              href={`/animals/${x.animal.id}`}
              className={`block relative rounded-3xl overflow-hidden shadow-lg ${style.ring}
                          active:scale-[0.98] transition-transform`}
            >
              <div className={`relative ${style.h} md:h-80`}>
                <Image
                  src={x.animal.images[0]?.url ?? ""}
                  alt={x.animal.japaneseName}
                  fill
                  className="object-cover object-[center_25%]"
                  sizes="100vw"
                  priority={i === 0}
                />
                {/* じゅんい メダル */}
                <span className="absolute top-3 left-3 text-6xl drop-shadow-lg">
                  {MEDALS[i]}
                </span>
                {/* したの グラデーション＋なまえ・すうじ */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-14 pb-4">
                  {i === 0 && (
                    <p className="text-white/85 text-sm font-bold mb-1">
                      {axis.emoji} {axis.topPhrase}
                    </p>
                  )}
                  <p
                    className={`text-white font-extrabold drop-shadow leading-tight ${style.name}`}
                  >
                    {x.animal.japaneseName}
                  </p>
                  <p
                    className={`text-amber-300 font-extrabold drop-shadow leading-tight mt-0.5 ${style.val}`}
                  >
                    {axis.format(x.v)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* 4位以降 */}
      {rest.length > 0 && (
        <section className="px-4 mt-6 md:max-w-2xl md:mx-auto">
          <h2 className="text-sm font-bold text-gray-400 mb-2 px-1">
            つづき
          </h2>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
            {rest.map((x, i) => (
              <Link
                key={x.animal.id}
                href={`/animals/${x.animal.id}`}
                className="flex items-center gap-3 px-3 py-2.5 active:bg-gray-50"
              >
                <span className="w-7 text-center font-bold text-gray-400">
                  {i + 4}
                </span>
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={x.animal.images[0]?.url ?? ""}
                    alt={x.animal.japaneseName}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <span className="flex-1 font-medium text-gray-700">
                  {x.animal.japaneseName}
                </span>
                <span className="font-bold text-gray-600">
                  {axis.format(x.v)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
