import { Mic, PhoneOff, User, Video } from "lucide-react";
import { projectIcon } from "@/lib/icons";

/**
 * Generated preview for projects without a screenshot: a mini browser window.
 * Video/WebRTC projects get a call UI; everything else gets the project's icon.
 */
export function ProjectArt({ title, tags }: { title: string; tags: string[] }) {
  const Icon = projectIcon(title, tags);
  const isCall = Icon === Video;

  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
      <div className="w-[82%] overflow-hidden rounded-xl border border-white/15 bg-[#0B0E24]/90 shadow-[0_24px_50px_-20px_rgb(0_0_0/0.7)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.03]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
        </div>
        {isCall ? (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/50 to-violet-500/30">
                <User className="h-7 w-7 text-white/80" />
                <span className="absolute bottom-1.5 left-1.5 h-1.5 w-8 rounded-full bg-white/40" />
              </div>
              <div className="relative flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/40 to-indigo-500/30">
                <User className="h-7 w-7 text-white/80" />
                <span className="absolute bottom-1.5 left-1.5 h-1.5 w-6 rounded-full bg-white/40" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80">
                <Mic size={13} />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80">
                <Video size={13} />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white">
                <PhoneOff size={13} />
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
              <Icon size={22} />
            </span>
            <span className="font-mono text-[12px] text-white/70">{title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
