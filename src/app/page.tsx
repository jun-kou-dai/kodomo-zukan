import Image from "next/image";
import Link from "next/link";
import { animals, getFeaturedAnimals } from "@/data/animals";
import { AnimalCard } from "@/components/AnimalCard";
import { ThemeTag } from "@/types/animal";

const habitatSections = [
  { key: "りく", label: "りく", emoji: "🌿", color: "from-green-400 to-emerald-500" },
  { key: "うみ", label: "うみ", emoji: "🌊", color: "from-blue-400 to-cyan-500" },
  { key: "そら", label: "そら", emoji: "☁️", color: "from-sky-300 to-blue-400" },
] as const;

const themeSections: { key: ThemeTag; label: string; emoji: string; color: string }[] = [
  { key: "つよい", label: "つよい", emoji: "💪", color: "from-red-400 to-rose-500" },
  { key: "はやい", label: "はやい", emoji: "⚡", color: "from-amber-400 to-yellow-500" },
  { key: "おおきい", label: "おおきい", emoji: "🏔️", color: "from-violet-400 to-purple-500" },
  { key: "かわいい", label: "かわいい", emoji: "🩷", color: "from-pink-300 to-rose-400" },
  { key: "へん", label: "へん", emoji: "🤪", color: "from-emerald-400 to-teal-500" },
  { key: "こわい", label: "こわい", emoji: "😱", color: "from-gray-500 to-gray-700" },
];

function getTodayAnimal() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return animals[dayOfYear % animals.length];
}

export default function HomePage() {
  const featured = getFeaturedAnimals().slice(0, 6);
  const todayAnimal = getTodayAnimal();

  return (
    <main className="pb-12">
      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-[#4A7C28] to-[#2D5016] text-white px-6 pt-10 pb-8 rounded-b-[2rem]">
        <h1 className="text-3xl font-extrabold tracking-tight">
          こども動物図鑑
        </h1>
        <p className="text-base mt-2 text-green-100">
          どうぶつを みる・きく・しる・くらべる
        </p>
        <Link
          href="/animals"
          className="mt-5 flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-2xl px-5 py-3.5
                     transition-colors text-white/90 text-base"
        >
          <span className="text-xl">🔍</span>
          <span>どうぶつを さがす</span>
        </Link>
      </section>

      {/* きょうの どうぶつ */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
          📅 きょうの どうぶつ
        </h2>
        <Link href={`/animals/${todayAnimal.id}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-md h-72">
            {todayAnimal.images[0] && (
              <Image
                src={todayAnimal.images[0].url}
                alt={todayAnimal.japaneseName}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white text-2xl font-bold">
                {todayAnimal.japaneseName}
              </p>
              <p className="text-white/80 text-sm mt-1 line-clamp-1">
                {todayAnimal.childSummary}
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* にんきの どうぶつ */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold text-gray-700">
            ⭐ にんきの どうぶつ
          </h2>
          <Link href="/animals" className="text-sm text-[#4A7C28] font-medium">
            ぜんぶみる →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featured.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </section>

      {/* すんでいる ばしょ */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
          🌍 すんでいる ばしょ
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {habitatSections.map((h) => (
            <Link
              key={h.key}
              href={`/animals?habitat=${h.key}`}
              className={`bg-gradient-to-br ${h.color} rounded-2xl p-4 text-center text-white
                         shadow-sm hover:shadow-md transition-shadow active:scale-95 transition-transform`}
            >
              <span className="text-3xl block">{h.emoji}</span>
              <span className="text-base font-bold mt-1 block">{h.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* テーマから さがす */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
          🎯 テーマから さがす
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {themeSections.map((t) => (
            <Link
              key={t.key}
              href={`/animals?tag=${t.key}`}
              className={`bg-gradient-to-br ${t.color} rounded-2xl p-4 text-center text-white
                         shadow-sm hover:shadow-md transition-shadow active:scale-95 transition-transform`}
            >
              <span className="text-2xl block">{t.emoji}</span>
              <span className="text-sm font-bold mt-1 block">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* くらべて みよう */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">
          ⚖️ くらべて みよう
        </h2>
        <Link
          href="/compare?a=lion&b=tiger"
          className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          <div className="flex">
            <div className="flex-1 relative h-48">
              {animals.find((a) => a.id === "lion")?.images[0] && (
                <Image
                  src={
                    animals.find((a) => a.id === "lion")!.images[0].url
                  }
                  alt="ライオン"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              )}
            </div>
            <div className="flex items-center justify-center px-3 bg-amber-50">
              <span className="text-2xl font-bold text-amber-500">VS</span>
            </div>
            <div className="flex-1 relative h-48">
              {animals.find((a) => a.id === "tiger")?.images[0] && (
                <Image
                  src={
                    animals.find((a) => a.id === "tiger")!.images[0]
                      .url
                  }
                  alt="トラ"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              )}
            </div>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="font-bold text-gray-700">ライオン</span>
            <span className="text-gray-400 text-sm">どっちが つよい？</span>
            <span className="font-bold text-gray-700">トラ</span>
          </div>
        </Link>
      </section>
    </main>
  );
}
