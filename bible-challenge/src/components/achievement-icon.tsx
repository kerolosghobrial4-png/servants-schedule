import { Award, BookOpen, Cross, Crown, Flame, Footprints, ScrollText, Shield, Star, Target, Trophy } from "lucide-react";
import { cx } from "./ui";

const ICONS = {
  step: Footprints,
  target: Target,
  flame: Flame,
  book: BookOpen,
  trophy: Trophy,
  star: Star,
  crown: Crown,
  scroll: ScrollText,
  shield: Shield,
  cross: Cross,
} as const;

export function AchievementIcon({ icon, earned = true, size = 24 }: { icon: string; earned?: boolean; size?: number }) {
  const Icon = ICONS[icon as keyof typeof ICONS] ?? Award;
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center shrink-0 border rotate-45 w-11 h-11",
        earned ? "border-gold text-gold bg-gold/10" : "border-line-strong text-dim",
      )}
      aria-hidden
    >
      <Icon size={size * 0.85} className="-rotate-45" strokeWidth={1.75} />
    </span>
  );
}
