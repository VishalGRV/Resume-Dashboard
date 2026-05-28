"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

export function ScoreBreakdownChart({
  atsScore,
  frontendScore,
  backendScore,
  industryReadiness
}: {
  atsScore: number;
  frontendScore: number;
  backendScore: number;
  industryReadiness: number;
}) {
  const data = [
    { metric: "ATS", value: atsScore },
    { metric: "Frontend", value: frontendScore },
    { metric: "Backend", value: backendScore },
    { metric: "Industry", value: industryReadiness }
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148,163,184,0.22)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 8 }} />
          <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
