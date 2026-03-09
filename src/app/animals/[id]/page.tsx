import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { animals, getAnimalById } from "@/data/animals";
import { TagBadge } from "@/components/TagBadge";
import { SoundButton } from "@/components/SoundButton";
import { VideoPlayer } from "@/components/VideoPlayer";
import { FullscreenImage } from "@/components/FullscreenImage";

export function generateStaticParams() {
  return animals.map((a) => ({ id: a.id }));
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

        {/* 音 */}
        {animal.sounds.length > 0 && (
          <SoundButton
            sound={animal.sounds[0]}
            animalName={animal.japaneseName}
          />
        )}

        {/* 動画 */}
        {animal.videos.length > 0 && (
          <VideoPlayer
            video={animal.videos[0]}
            animalName={animal.japaneseName}
          />
        )}

        {/* きほんじょうほう */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-700 mb-4">
            📋 きほん じょうほう
          </h2>
          <div className="space-y-3">
            <InfoRow label="🌍 すむ ばしょ" value={animal.habitatText} />
            <InfoRow label="🍽️ たべもの" value={animal.dietText} />
            <InfoRow label="📏 おおきさ" value={animal.sizeText} />
            <InfoRow label="⚡ はやさ" value={animal.speedText} />
            <InfoRow label="⚖️ おもさ" value={animal.weightText} />
            <InfoRow label="⏳ じゅみょう" value={animal.lifespanText} />
            <InfoRow
              label="📖 なかま"
              value={`${animal.classificationClass} / ${animal.classificationFamily}`}
            />
            <InfoRow
              label="🔬 がくめい"
              value={animal.scientificName}
              italic
            />
          </div>
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

function InfoRow({
  label,
  value,
  italic,
}: {
  label: string;
  value: string;
  italic?: boolean;
}) {
  return (
    <div className="flex gap-3 items-start">
      <span className="text-sm text-gray-500 shrink-0 w-28">{label}</span>
      <span
        className={`text-base text-gray-800 ${italic ? "italic text-sm text-gray-500" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
