import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findUnique: vi.fn()
}));

vi.mock("@/lib/auth", () => ({
  auth: mocks.auth
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique
    }
  }
}));

import { GET } from "@/app/api/profile/route";

describe("GET /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Vishal",
      email: "vishal@example.com",
      createdAt: new Date("2026-06-01T10:00:00.000Z"),
      resumes: []
    });
  });

  it("returns 401 when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  it("returns profile data for the authenticated user", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user).toMatchObject({
      id: "user-1",
      name: "Vishal",
      email: "vishal@example.com",
      resumes: []
    });
  });

  it("queries by session user id and excludes the password field", async () => {
    await GET();

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        resumes: {
          orderBy: { uploadedAt: "desc" },
          select: {
            id: true,
            uploadedAt: true,
            resumeText: true,
            analysisReports: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                atsScore: true,
                industryReadiness: true,
                createdAt: true
              }
            }
          }
        }
      }
    });
  });

  it("returns uploaded resumes with their latest report summary", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Vishal",
      email: "vishal@example.com",
      createdAt: new Date("2026-06-01T10:00:00.000Z"),
      resumes: [
        {
          id: "resume-1",
          uploadedAt: new Date("2026-06-20T10:00:00.000Z"),
          resumeText: "Resume content",
          analysisReports: [
            {
              id: "report-1",
              atsScore: 82,
              industryReadiness: 78,
              createdAt: new Date("2026-06-20T10:01:00.000Z")
            }
          ]
        }
      ]
    });

    const response = await GET();
    const body = await response.json();

    expect(body.user.resumes).toHaveLength(1);
    expect(body.user.resumes[0].analysisReports[0]).toMatchObject({
      id: "report-1",
      atsScore: 82,
      industryReadiness: 78
    });
  });

  it("returns a null user when no matching profile exists", async () => {
    mocks.findUnique.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ user: null });
  });
});
