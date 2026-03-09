export type AnimalClass =
  | "ほにゅうるい"
  | "とり"
  | "さかな"
  | "はちゅうるい"
  | "りょうせいるい"
  | "こんちゅう"
  | "うみのいきもの";

export type Habitat = "りく" | "うみ" | "そら" | "りくとうみ" | "りくとそら";

export type ThemeTag =
  | "つよい"
  | "はやい"
  | "おおきい"
  | "かわいい"
  | "へん"
  | "こわい";

export interface AnimalImage {
  url: string;
  thumbnailUrl: string;
  sourceName: string;
  sourcePageUrl: string;
  licenseName: string;
  attribution: string;
  isPrimary: boolean;
}

export interface AnimalSound {
  url: string;
  sourceName: string;
  sourcePageUrl: string;
  licenseName: string;
  attribution: string;
  durationSec: number;
}

export interface AnimalVideo {
  provider: "youtube";
  videoId: string;
  embedUrl: string;
  sourcePageUrl: string;
  title: string;
  durationSec: number;
}

export interface CompareFact {
  key: string;
  value: string;
  displayOrder: number;
}

export interface Animal {
  id: string;
  scientificName: string;
  japaneseName: string;
  kanaName: string;
  englishName: string;
  classificationClass: AnimalClass;
  classificationOrder: string;
  classificationFamily: string;
  habitat: Habitat;
  habitatText: string;
  dietText: string;
  sizeText: string;
  speedText: string;
  weightText: string;
  lifespanText: string;
  childSummary: string;
  childSecret: string;
  tags: ThemeTag[];
  featuredFlag: boolean;
  popularityRank: number;
  images: AnimalImage[];
  sounds: AnimalSound[];
  videos: AnimalVideo[];
  compareFacts: CompareFact[];
  similarAnimalIds: string[];
}
