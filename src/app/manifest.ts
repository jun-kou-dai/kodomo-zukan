import type { MetadataRoute } from "next";

const basePath = process.env.NODE_ENV === "production" ? "/kodomo-zukan" : "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "こども動物図鑑",
    short_name: "どうぶつ図鑑",
    description: "動物を 見る・聞く・知る・くらべる。子どもの どうぶつ図鑑",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#4A7C28",
    lang: "ja",
    icons: [
      {
        src: `${basePath}/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
