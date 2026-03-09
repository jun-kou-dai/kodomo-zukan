import { ThemeTag } from "@/types/animal";

const tagConfig: Record<ThemeTag, { label: string; className: string }> = {
  つよい: {
    label: "💪 つよい",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  はやい: {
    label: "⚡ はやい",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  おおきい: {
    label: "🏔️ おおきい",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  かわいい: {
    label: "🩷 かわいい",
    className: "bg-pink-50 text-pink-700 border-pink-200",
  },
  へん: {
    label: "🤪 へん",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  こわい: {
    label: "😱 こわい",
    className: "bg-gray-100 text-gray-700 border-gray-300",
  },
};

export function TagBadge({ tag, size = "sm" }: { tag: ThemeTag; size?: "sm" | "md" }) {
  const config = tagConfig[tag];
  if (!config) return null;

  const sizeClass = size === "md" ? "text-sm px-3 py-1" : "text-xs px-2 py-0.5";

  return (
    <span
      className={`inline-block rounded-full border font-medium ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
