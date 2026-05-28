"use client";

import { useEffect, useState } from "react";
import { CalendarDays, FileText, Mail, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProfileUser = {
  name: string;
  email: string;
  createdAt: string;
  resumes: {
    id: string;
    uploadedAt: string;
    resumeText: string;
    analysisReports: {
      id: string;
      atsScore: number;
      industryReadiness: number;
      createdAt: string;
    }[];
  }[];
};

export function ProfileView() {
  const [user, setUser] = useState<ProfileUser | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (response.ok) setUser(data.user);
    }

    loadProfile();
  }, []);

  if (!user) {
    return <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-400 sm:px-6 lg:px-8">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6">
        <p className="text-sm font-medium text-teal-300">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Account and resume history</h1>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>User information</CardTitle>
            <CardDescription>Credentials-authenticated user stored in PostgreSQL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={UserRound} label="Name" value={user.name} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={CalendarDays} label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded resumes</CardTitle>
            <CardDescription>{user.resumes.length} resume submission{user.resumes.length === 1 ? "" : "s"} saved.</CardDescription>
          </CardHeader>
          <CardContent>
            {user.resumes.length === 0 ? (
              <p className="text-sm text-slate-400">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {user.resumes.map((resume) => {
                  const latest = resume.analysisReports[0];
                  return (
                    <div key={resume.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-sm font-medium text-white">
                            <FileText className="size-4 text-teal-300" />
                            Resume submitted {new Date(resume.uploadedAt).toLocaleDateString()}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{resume.resumeText}</p>
                        </div>
                        {latest ? (
                          <div className="flex gap-2">
                            <Badge>ATS {latest.atsScore}</Badge>
                            <Badge>Ready {latest.industryReadiness}</Badge>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="flex size-10 items-center justify-center rounded-md bg-teal-400/10 text-teal-200">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
