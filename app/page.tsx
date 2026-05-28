import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Database, FileText, Lock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Resume intake",
    body: "Paste resume text or upload a text-based PDF for quick analysis."
  },
  {
    icon: BrainCircuit,
    title: "Rule-based intelligence",
    body: "Scores skills, readiness, strengths, weaknesses, and next steps without expensive AI APIs."
  },
  {
    icon: BarChart3,
    title: "Recruiter-ready analytics",
    body: "Visualizes ATS score, frontend/backend strength, skill gaps, and history."
  },
  {
    icon: Database,
    title: "SaaS architecture",
    body: "Next.js API routes, Auth.js credentials auth, Prisma, and PostgreSQL."
  }
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <Badge className="mb-5 border-teal-300/20 bg-teal-300/10 text-teal-100">MVP SaaS · ATS · Skill intelligence</Badge>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">AI Resume Intelligence Dashboard</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
              A polished resume analysis product that turns a candidate resume into scores, skill gaps, strengths, recommendations, and visual analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Build my analysis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/login">View dashboard</Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-xl gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {["No model training", "PostgreSQL-backed", "Credentials auth", "Vercel-ready"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-teal-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Latest analysis</p>
                    <p className="mt-1 text-lg font-semibold text-white">Full-stack internship resume</p>
                  </div>
                  <Badge className="bg-teal-400/15 text-teal-100">ATS 82</Badge>
                </div>
              </div>
              <div className="grid gap-4 p-5">
                {[
                  ["Frontend", 86],
                  ["Backend", 71],
                  ["Industry readiness", 78]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
                  <p className="mb-3 text-sm font-medium text-white">Detected skills</p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "TypeScript", "SQL", "Git", "Tailwind"].map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="transition hover:-translate-y-0.5 hover:border-white/25">
                <CardContent className="p-5">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-white/10 text-teal-200">
                    <feature.icon className="size-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Lock className="size-4 text-teal-300" />
            Secure password hashing with bcrypt and private user-specific reports.
          </div>
        </section>
      </main>
    </>
  );
}
