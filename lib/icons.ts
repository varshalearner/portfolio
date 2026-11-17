import {
  Award,
  BookOpen,
  Bot,
  Braces,
  Brain,
  Briefcase,
  Code2,
  FlaskConical,
  Gauge,
  GitBranch,
  GraduationCap,
  Layers,
  MapPin,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Timer,
  UtensilsCrossed,
  Video,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Icons are picked from the text the owner writes, so new content still gets a sensible icon. */

export function skillGroupIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (/language/.test(n)) return Braces;
  if (/api/.test(n)) return Network;
  if (/perf|reliab|load/.test(n)) return Gauge;
  if (/secur|identity|auth/.test(n)) return ShieldCheck;
  if (/ci|cd|devops|cloud/.test(n)) return Workflow;
  if (/\bai\b|llm|claude/.test(n)) return Sparkles;
  if (/tool/.test(n)) return Wrench;
  return Layers;
}

export function factIcon(label: string): LucideIcon {
  const n = label.toLowerCase();
  if (/experience|years|role/.test(n)) return Briefcase;
  if (/award|recogn/.test(n)) return Award;
  if (/release|ship|deploy/.test(n)) return Rocket;
  if (/location|based|city/.test(n)) return MapPin;
  if (/education|degree|college|universit/.test(n)) return GraduationCap;
  return Sparkles;
}

const IMPACT_FALLBACK: LucideIcon[] = [Timer, Layers, Bot, Zap];

export function impactIcon(title: string, index: number): LucideIcon {
  const n = title.toLowerCase();
  if (/\bai\b|analy[sz]er|claude|llm/.test(n)) return Bot;
  if (/chaos|reliab|resilien|bug/.test(n)) return Zap;
  if (/regression|faster|runtime|→/.test(n)) return Timer;
  if (/scratch|suite|framework/.test(n)) return Layers;
  return IMPACT_FALLBACK[index % IMPACT_FALLBACK.length];
}

export function postIcon(tags: string[]): LucideIcon {
  const n = tags.join(" ").toLowerCase();
  if (/chaos|resilien|reliab/.test(n)) return Zap;
  if (/optimi|parallel|rest-assured/.test(n)) return Timer;
  if (/\bai\b|claude|llm|triage/.test(n)) return Sparkles;
  if (/secur|auth|jwt|oidc|saml|mtls/.test(n)) return ShieldCheck;
  if (/perf|k6|load|longevity/.test(n)) return Gauge;
  if (/ci-cd|github-actions|jenkins|pipeline/.test(n)) return GitBranch;
  if (/pytest|api|negative|framework|strategy/.test(n)) return FlaskConical;
  return BookOpen;
}

export function projectIcon(title: string, tags: string[]): LucideIcon {
  const n = `${title} ${tags.join(" ")}`.toLowerCase();
  if (/video|webrtc|call/.test(n)) return Video;
  if (/\bml\b|machine learning|predict|cancer/.test(n)) return Brain;
  if (/food|restaurant|order/.test(n)) return UtensilsCrossed;
  if (/test|qa|pytest|k6|playwright/.test(n)) return FlaskConical;
  return Code2;
}
