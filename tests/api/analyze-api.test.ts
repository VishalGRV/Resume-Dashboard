import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  resumeCreate: vi.fn(),
  analyzeResume: vi.fn()
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.auth
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    resume: {
      create: mocks.resumeCreate
    }
  }
}));

vi.mock("@/lib/analyzer/analyze-resume", () => ({
  analyzeResume: mocks.analyzeResume
}));

import { POST } from "@/app/api/analyze/route";

const validResumeText = `
  Full-stack developer experienced with React, Next.js, TypeScript, Node.js,
  PostgreSQL, Prisma, Git, and Docker. Built and deployed multiple production
  projects with measurable performance improvements.
`;

const analysisResult = {
  atsScore: 82,
  frontendScore: 88,
  backendScore: 75,
  industryReadiness: 80,
  strengths: ["Strong frontend profile."],
  weaknesses: ["Add more measurable outcomes."],
  recommendations: ["Add one API-backed project."],
  detectedSkills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Git", "Docker"],
  missingSkills: ["SQL"],
  skillDistribution: {
    frontend: 3,
    backend: 3,
    devops: 1,
    programming: 0,
    ai: 0,
    tools: 1
  }
};

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.analyzeResume.mockReturnValue(analysisResult);
    mocks.resumeCreate.mockResolvedValue({
      id: "resume-1",
      analysisReports: [{ id: "report-1", ...analysisResult }]
    });
  });

  it("returns 401 when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await POST(jsonRequest({ resumeText: validResumeText }));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(mocks.resumeCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when JSON resume text is too short", async () => {
    const response = await POST(jsonRequest({ resumeText: "Too short" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("80 characters");
    expect(mocks.analyzeResume).not.toHaveBeenCalled();
  });

  it("returns 400 when resumeText is missing", async () => {
    const response = await POST(jsonRequest({}));

    expect(response.status).toBe(400);
    expect(mocks.resumeCreate).not.toHaveBeenCalled();
  });

  it("analyzes and saves a valid resume", async () => {
    const response = await POST(jsonRequest({ resumeText: validResumeText }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.analyzeResume).toHaveBeenCalledWith(validResumeText);
    expect(mocks.resumeCreate).toHaveBeenCalledOnce();
    expect(body.resumeId).toBe("resume-1");
    expect(body.report).toMatchObject({ id: "report-1", atsScore: 82 });
  });

  it("connects the saved resume to the authenticated user and nested report", async () => {
    await POST(jsonRequest({ resumeText: validResumeText }));

    expect(mocks.resumeCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        resumeText: validResumeText,
        analysisReports: {
          create: analysisResult
        }
      },
      include: {
        analysisReports: true
      }
    });
  });

  it("rejects a multipart upload that is not a PDF", async () => {
    const formData = new FormData();
    formData.set("file", new File(["resume"], "resume.txt", { type: "text/plain" }));

    const response = await POST(
      new Request("http://localhost/api/analyze", {
        method: "POST",
        body: formData
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Only PDF uploads are supported.");
  });

  it("returns 500 when persistence fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.resumeCreate.mockRejectedValue(new Error("Database unavailable"));

    const response = await POST(jsonRequest({ resumeText: validResumeText }));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("Unable to analyze this resume");
    consoleError.mockRestore();
  });
});
