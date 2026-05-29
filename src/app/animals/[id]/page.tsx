import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { animals, getAnimalById } from "@/data/animals";
import { TagBadge } from "@/components/TagBadge";
import { MediaButtons } from "@/components/MediaButtons";
import { FullscreenImage } from "@/components/FullscreenImage";
import { ShareButton } from "@/components/ShareButton";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const animal = getAnimalById(id);
  if (!animal) return { title: "こども動物図鑑" };

  const image = animal.images.find((img) => img.isPrimary) || animal.images[0];
  const title = `${animal.japaneseName} | こども動物図鑑`;
  const description = animal.childSecret;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const animal = getAnimalById(id);
  if (!animal) notFound();

  const primaryImage = animal.images.find((img) => img.isPrimary) || animal.images[0];
  const similarAnimals = animal.similarAnimalIds
    .map((sid) => getAnimalById(sid))
    .filter(Boolean);

  return (
    <main className="pb-12">
      {/* 写真が主役 - フルワイド */}
      <div className="relative">
        {primaryImage ? (
          <div className="relative w-full h-[50vh] min-h-[300px]">
            <Image
              src={primaryImage.url}
              alt={animal.japaneseName}
              fill
              className="object-cover object-[center_20%]"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <FullscreenImage
              src={primaryImage.url}
              alt={animal.japaneseName}
              attribution={primaryImage.attribution}
              licenseName={primaryImage.licenseName}
              sourceName={primaryImage.sourceName}
            />
          </div>
        ) : (
          <div className="w-full h-[40vh] bg-gray-100 flex items-center justify-center">
            <span className="text-6xl">🦁</span>
          </div>
        )}

        {/* 戻るボタン */}
        <Link
          href="/animals"
          className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white
                     w-10 h-10 rounded-full flex items-center justify-center
                     active:scale-90 transition-transform text-lg"
        >
          ←
        </Link>

        {/* 名前オーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            {animal.japaneseName}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {animal.kanaName} / {animal.englishName}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {animal.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="md" />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* 一言説明 */}
        <p className="text-lg leading-relaxed text-gray-700 font-medium">
          {animal.childSummary}
        </p>

        {/* こえ・うごく すがた */}
        <MediaButtons
          sound={animal.sounds[0]}
          video={animal.videos[0]}
          animalName={animal.japaneseName}
        />

        {/* きほんじょうほう */}
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3">
            📋 きほん じょうほう
          </h2>
          <div className="space-y-2.5">
            <FactCard tone="emerald" emoji="🌍" label="すむ ばしょ" value={animal.habitatText} />
            <FactCard tone="orange" emoji="🍽️" label="たべもの" value={animal.dietText} />
            <FactCard tone="sky" emoji="📏" label="おおきさ" value={animal.sizeText} />
            <FactCard tone="amber" emoji="⚡" label="はやさ" value={animal.speedText} />
            <FactCard tone="rose" emoji="⚖️" label="おもさ" value={animal.weightText} />
            <FactCard tone="violet" emoji="⏳" label="いきる ながさ" value={animal.lifespanText} />
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            なかま: {animal.classificationClass} / {animal.classificationFamily}
            　がくめい: <span className="italic">{animal.scientificName}</span>
          </p>
        </section>

        {/* ひみつ */}
        <section className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-100">
          <h2 className="text-base font-bold text-amber-700 mb-2">
            🤫 ひみつ・まめちしき
          </h2>
          <p className="text-base leading-relaxed text-amber-900">
            {animal.childSecret}
          </p>
        </section>

        {/* おしえる（シェア） */}
        <ShareButton
          animalName={animal.japaneseName}
          secret={animal.childSecret}
        />

        {/* にている どうぶつ */}
        {similarAnimals.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-700 mb-3">
              🔗 にている どうぶつ
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similarAnimals.map((sa) => {
                if (!sa) return null;
                const img = sa.images.find((i) => i.isPrimary) || sa.images[0];
                return (
                  <Link
                    key={sa.id}
                    href={`/animals/${sa.id}`}
                    className="shrink-0 w-32"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <div className="relative h-24">
                        {img && (
                          <Image
                            src={img.url}
                            alt={sa.japaneseName}
                            fill
                            className="object-cover object-[center_20%]"
                            sizes="128px"
                          />
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-700 p-2 text-center">
                        {sa.japaneseName}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* くらべるボタン */}
        <Link
          href={`/compare?a=${animal.id}`}
          className="block w-full bg-[#4A7C28] text-white text-center py-4 rounded-2xl
                     text-lg font-bold active:scale-95 transition-transform shadow-md"
        >
          ⚖️ ほかの どうぶつと くらべる
        </Link>

        {/* ライセンス情報 */}
        {primaryImage && (
          <p className="text-xs text-gray-300 text-center">
            写真: {primaryImage.attribution} / {primaryImage.licenseName} (
            {primaryImage.sourceName})
          </p>
        )}
      </div>
    </main>
  );
}

const FACT_TONES = {
  emerald: { bg: "bg-emerald-50", chip: "bg-emerald-100", label: "text-emerald-600" },
  orange: { bg: "bg-orange-50", chip: "bg-orange-100", label: "text-orange-600" },
  sky: { bg: "bg-sky-50", chip: "bg-sky-100", label: "text-sky-600" },
  amber: { bg: "bg-amber-50", chip: "bg-amber-100", label: "text-amber-600" },
  rose: { bg: "bg-rose-50", chip: "bg-rose-100", label: "text-rose-600" },
  violet: { bg: "bg-violet-50", chip: "bg-violet-100", label: "text-violet-600" },
} as const;

function FactCard({
  tone,
  emoji,
  label,
  value,
}: {
  tone: keyof typeof FACT_TONES;
  emoji: string;
  label: string;
  value: string;
}) {
  const t = FACT_TONES[tone];
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 ${t.bg}`}>
      <span
        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${t.chip}`}
      >
        {emoji}
      </span>
      <div className="min-w-0">
        <p className={`text-xs font-bold ${t.label}`}>{label}</p>
        <p className="text-base text-gray-800 leading-snug">{value}</p>
      </div>
    </div>
  );
}
