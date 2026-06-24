import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findMany: vi.fn()
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.auth
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    resume: {
      findMany: mocks.findMany
    }
  }
}));

import { GET } from "@/app/api/reports/route";

describe("GET /api/reports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.findMany.mockResolvedValue([]);
  });

  it("returns 401 when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it("returns an empty array when the user has no reports", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ reports: [] });
  });

  it("queries only resumes belonging to the authenticated user", async () => {
    await GET();

    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1"
      },
      orderBy: {
        uploadedAt: "desc"
      },
      include: {
        analysisReports: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });
  });

  it("flattens reports from multiple resumes into one history list", async () => {
    mocks.findMany.mockResolvedValue([
      {
        id: "resume-1",
        resumeText: "Resume one content",
        uploadedAt: new Date("2026-06-20T10:00:00.000Z"),
        analysisReports: [
          { id: "report-1", atsScore: 80 },
          { id: "report-2", atsScore: 75 }
        ]
      },
      {
        id: "resume-2",
        resumeText: "Resume two content",
        uploadedAt: new Date("2026-06-19T10:00:00.000Z"),
        analysisReports: [{ id: "report-3", atsScore: 70 }]
      }
    ]);

    const response = await GET();
    const body = await response.json();

    expect(body.reports).toHaveLength(3);
    expect(body.reports.map((report: { id: string }) => report.id)).toEqual([
      "report-1",
      "report-2",
      "report-3"
    ]);
  });

  it("adds the parent resume id and upload date to every report", async () => {
    const uploadedAt = new Date("2026-06-20T10:00:00.000Z");
    mocks.findMany.mockResolvedValue([
      {
        id: "resume-1",
        resumeText: "Resume content",
        uploadedAt,
        analysisReports: [{ id: "report-1", atsScore: 80 }]
      }
    ]);

    const response = await GET();
    const body = await response.json();

    expect(body.reports[0]).toMatchObject({
      id: "report-1",
      resumeId: "resume-1",
      uploadedAt: uploadedAt.toISOString()
    });
  });

  it("limits the resume preview to 180 characters", async () => {
    mocks.findMany.mockResolvedValue([
      {
        id: "resume-1",
        resumeText: "A".repeat(250),
        uploadedAt: new Date(),
        analysisReports: [{ id: "report-1", atsScore: 80 }]
      }
    ]);

    const response = await GET();
    const body = await response.json();

    expect(body.reports[0].preview).toHaveLength(180);
  });
});
