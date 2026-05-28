import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ScoreCard({ title, value, icon: Icon, tone }: { title: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:border-white/25">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </div>
          <div className={`flex size-11 items-center justify-center rounded-md ${tone}`}>
            <Icon className="size-5" />
          </div>
        </div>
        <Progress value={value} className="mt-5" />
      </CardContent>
    </Card>
  );
}
