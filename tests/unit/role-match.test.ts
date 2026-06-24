import { describe, expect, it } from "vitest";
import { analyzeRoleMatch } from "@/lib/analyzer/role-match";

describe("analyzeRoleMatch", () => {
  it("compares detected resume skills with a target job description", () => {
    const result = analyzeRoleMatch({
      targetRole: "Frontend Developer at Zoho",
      detectedSkills: ["React", "JavaScript", "Tailwind", "Git"],
      jobDescription: `
        We are hiring a Frontend Developer with React, TypeScript, Next.js, Tailwind,
        REST API integration, Git, and strong UI engineering experience.
      `
    });

    expect(result.targetRole).toBe("Frontend Developer at Zoho");
    expect(result.matchedSkills).toEqual(expect.arrayContaining(["React", "Tailwind", "Git"]));
    expect(result.missingRoleSkills).toEqual(expect.arrayContaining(["TypeScript", "Next.js", "REST API"]));
    expect(result.matchScore).toBeGreaterThan(0);
    expect(result.matchScore).toBeLessThan(100);
    expect(result.roadmap.length).toBeGreaterThan(0);
    expect(result.suggestions[0]).toContain("TypeScript");
  });

  it("detects missing role skills from job description aliases", () => {
    const result = analyzeRoleMatch({
      targetRole: "Full Stack Developer",
      detectedSkills: ["React", "JavaScript"],
      jobDescription: "Role requires nextjs, nodejs, postgres, rest api development, docker, and github actions."
    });

    expect(result.missingRoleSkills).toEqual(expect.arrayContaining(["Next.js", "Node.js", "PostgreSQL", "REST API", "Docker", "GitHub Actions"]));
    expect(result.matchScore).toBeLessThan(50);
  });

  it("returns a tailored roadmap when no role skill gaps are found", () => {
    const result = analyzeRoleMatch({
      targetRole: "Backend Intern",
      detectedSkills: ["Node.js", "Express", "SQL", "PostgreSQL"],
      jobDescription: "Backend intern role requiring Node.js, Express, SQL, and PostgreSQL project experience."
    });

    expect(result.matchScore).toBe(100);
    expect(result.missingRoleSkills).toHaveLength(0);
    expect(result.roadmap).toEqual(expect.arrayContaining(["Tailor the resume summary to the target role and company."]));
  });

  it("creates a four-week roadmap when role skill gaps exist", () => {
    const result = analyzeRoleMatch({
      targetRole: "DevOps Intern",
      detectedSkills: ["Git", "GitHub"],
      jobDescription: "Looking for Docker, AWS, CI/CD, GitHub Actions, and Vercel deployment knowledge."
    });

    expect(result.roadmap).toHaveLength(4);
    expect(result.roadmap[0]).toContain("Week 1");
    expect(result.roadmap[1]).toContain("Week 2");
  });

  it("falls back to a clear summary when no recognizable job keywords are found", () => {
    const result = analyzeRoleMatch({
      targetRole: "Product Intern",
      detectedSkills: ["React", "TypeScript"],
      jobDescription: "We need a curious student who can communicate well and learn quickly."
    });

    expect(result.matchScore).toBe(0);
    expect(result.matchedSkills).toHaveLength(0);
    expect(result.summary).toContain("does not contain enough recognizable technical keywords");
  });

  it("normalizes an empty target role to a readable label", () => {
    const result = analyzeRoleMatch({
      targetRole: "   ",
      detectedSkills: ["Python"],
      jobDescription: "Python and Machine Learning experience required."
    });

    expect(result.targetRole).toBe("the selected role");
    expect(result.matchedSkills).toEqual(expect.arrayContaining(["Python"]));
    expect(result.missingRoleSkills).toEqual(expect.arrayContaining(["Machine Learning"]));
  });
});
