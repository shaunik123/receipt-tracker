import { Nudge } from "@shared/routes";
import { Bell, Zap, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NudgeAlertProps {
  nudge: Nudge;
  onRead: (id: number) => void;
}

export function NudgeAlert({ nudge, onRead }: NudgeAlertProps) {
  const styles = {
    alert: "bg-red-500/10 border-red-500/20 text-red-200",
    insight: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    nudge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
  };

  const icons = {
    alert: Bell,
    insight: TrendingUp,
    nudge: Zap,
  };

  const Icon = icons[nudge.type as keyof typeof icons] || Bell;

  return (
    <div className={cn(
      "relative p-4 rounded-2xl border mb-3 transition-all",
      styles[nudge.type as keyof typeof styles]
    )}>
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{nudge.title}</h4>
          <p className="text-xs opacity-90 leading-relaxed">{nudge.message}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRead(nudge.id);
          }}
          className="shrink-0 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
