"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit, Code2, Database, FileText, Loader2, UploadCloud } from "lucide-react";
import { ScoreCard } from "@/components/cards/score-card";
import { ScoreBreakdownChart } from "@/components/charts/score-breakdown-chart";
import { SkillDistributionChart } from "@/components/charts/skill-distribution-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AnalysisResult, SkillDistribution } from "@/types/analysis";

type Report = AnalysisResult & {
  id: string;
  createdAt: string;
  uploadedAt?: string;
  preview?: string;
};

const sampleResume = `Frontend Developer with 2 years of experience building React and Next.js applications. Built responsive dashboards using TypeScript, JavaScript, HTML, CSS, Tailwind, REST API integrations, Git, GitHub, and PostgreSQL. Developed projects with authentication, reusable components, and deployed on Vercel. Improved page load performance by 35% and automated reporting workflows.`;

function normalizeReport(report: Report): Report {
  return {
    ...report,
    skillDistribution: report.skillDistribution as SkillDistribution
  };
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export function ResumeAnalyzer({ userName }: { userName: string }) {
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  const activeReport = reports[0];

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/reports");
        const data = await response.json();
        if (response.ok) {
          setReports(data.reports.map(normalizeReport));
        }
      } finally {
        setHistoryLoading(false);
      }
    }

    loadReports();
  }, []);

  const scoreCards = useMemo(() => {
    if (!activeReport) return [];
    return [
      { title: "ATS score", value: activeReport.atsScore, icon: FileText, tone: "bg-teal-400/15 text-teal-200" },
      { title: "Frontend", value: activeReport.frontendScore, icon: Code2, tone: "bg-sky-400/15 text-sky-200" },
      { title: "Backend", value: activeReport.backendScore, icon: Database, tone: "bg-emerald-400/15 text-emerald-200" },
      { title: "Industry readiness", value: activeReport.industryReadiness, icon: Activity, tone: "bg-amber-400/15 text-amber-200" }
    ];
  }, [activeReport]);

  async function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resumeText", resumeText);
      if (file) formData.append("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });
      const data = await readJsonResponse(response);
      if (!response.ok) throw new Error(data.error ?? "Unable to analyze resume.");

      setReports((current) => [normalizeReport(data.report), ...current]);
      setResumeText("");
      setFile(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-teal-300">AI Resume Intelligence Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white md:text-4xl">Welcome, {userName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Upload a resume PDF or paste content to generate ATS scoring, skill intelligence, readiness analytics, and recruiter-friendly recommendations.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => setResumeText(sampleResume)}>
          <BrainCircuit className="size-4" />
          Load sample
        </Button>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Analyze resume</CardTitle>
            <CardDescription>PDF parsing is supported when the file contains selectable text.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-file">Resume PDF</Label>
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-slate-950/50 px-4 py-6 text-center transition hover:border-teal-300/60">
                  <UploadCloud className="mb-2 size-7 text-teal-300" />
                  <span className="text-sm font-medium text-slate-200">{file ? file.name : "Upload PDF"}</span>
                  <span className="mt-1 text-xs text-slate-500">Or paste text below</span>
                  <input id="resume-file" type="file" accept="application/pdf" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-text">Resume text</Label>
                <Textarea id="resume-text" value={resumeText} onChange={(event) => setResumeText(event.target.value)} placeholder="Paste resume content here..." />
              </div>
              {error ? <p className="rounded-md border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <BrainCircuit className="size-4" />}
                {loading ? "Analyzing Resume..." : "Generate analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {activeReport ? (
            scoreCards.map((card) => <ScoreCard key={card.title} {...card} />)
          ) : (
            <Card className="sm:col-span-2">
              <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <BrainCircuit className="mb-4 size-10 text-teal-300" />
                <h2 className="text-xl font-semibold text-white">Your analysis will appear here</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Run a resume through the analyzer to unlock score cards, charts, missing skills, and action recommendations.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {activeReport ? (
        <>
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Skill distribution</CardTitle>
                <CardDescription>Detected skills grouped by engineering area.</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillDistributionChart distribution={activeReport.skillDistribution} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Score breakdown</CardTitle>
                <CardDescription>Readiness profile across ATS and technical dimensions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreBreakdownChart {...activeReport} />
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <InsightList title="Strengths" items={activeReport.strengths} />
            <InsightList title="Weaknesses" items={activeReport.weaknesses} />
            <InsightList title="Recommendations" items={activeReport.recommendations} />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <SkillPanel title="Detected skills" skills={activeReport.detectedSkills} />
            <SkillPanel title="Missing priority skills" skills={activeReport.missingSkills} muted />
          </section>
        </>
      ) : null}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis history</CardTitle>
          <CardDescription>Every analysis is saved to PostgreSQL through Prisma.</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <p className="text-sm text-slate-400">Loading history...</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-slate-400">No resume analyses yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <button
                  type="button"
                  key={report.id}
                  onClick={() => setReports((current) => [report, ...current.filter((item) => item.id !== report.id)])}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.07]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">ATS {report.atsScore} · Readiness {report.industryReadiness}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge>{report.detectedSkills.length} skills</Badge>
                      <Badge>{report.missingSkills.length} gaps</Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-6 text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SkillPanel({ title, skills, muted = false }: { title: string; skills: string[]; muted?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Badge key={skill} className={muted ? "bg-amber-400/10 text-amber-100" : "bg-teal-400/10 text-teal-100"}>
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-400">No items detected.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
