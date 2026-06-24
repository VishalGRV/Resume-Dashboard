import { describe, expect, it } from "vitest";
import { analyzeResume } from "@/lib/analyzer/analyze-resume";
import { analyzeRoleMatch } from "@/lib/analyzer/role-match";

describe("resume and target-role workflow", () => {
  it("passes detected resume skills into target-role matching", () => {
    const resumeResult = analyzeResume(`
      Frontend developer experienced with React, JavaScript, TypeScript, Tailwind, and Git.
      Built and deployed responsive dashboards with reusable components and measurable outcomes.
    `);

    const roleResult = analyzeRoleMatch({
      targetRole: "Frontend Developer",
      detectedSkills: resumeResult.detectedSkills,
      jobDescription: `
        Looking for React, TypeScript, Next.js, Tailwind, REST API, Git,
        and PostgreSQL experience.
      `
    });

    expect(roleResult.matchedSkills).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Tailwind", "Git"])
    );
    expect(roleResult.missingRoleSkills).toEqual(
      expect.arrayContaining(["Next.js", "REST API", "PostgreSQL"])
    );
    expect(roleResult.roadmap).toHaveLength(4);
  });

  it("produces a complete dashboard-ready analysis result", () => {
    const result = analyzeResume(`
      Full-stack developer using React, Next.js, TypeScript, Tailwind, Node.js,
      REST API, PostgreSQL, Prisma, Git, Docker, and GitHub Actions.
      Built, deployed, and improved three production projects by 35%.
    `);

    expect(result).toMatchObject({
      atsScore: expect.any(Number),
      frontendScore: expect.any(Number),
      backendScore: expect.any(Number),
      industryReadiness: expect.any(Number),
      detectedSkills: expect.any(Array),
      missingSkills: expect.any(Array),
      strengths: expect.any(Array),
      weaknesses: expect.any(Array),
      recommendations: expect.any(Array),
      skillDistribution: expect.any(Object)
    });
  });

  it("turns a limited resume into weaknesses and improvement guidance", () => {
    const result = analyzeResume(`
      Student developer familiar with HTML and CSS.
      Created one basic college project.
    `);

    expect(result.weaknesses.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.missingSkills).toEqual(
      expect.arrayContaining(["TypeScript", "React", "SQL", "Git"])
    );
  });

  it("keeps detected skill totals aligned with the chart distribution", () => {
    const result = analyzeResume(`
      React, Next.js, TypeScript, Tailwind, Node.js, Express, PostgreSQL,
      Prisma, Docker, AWS, Python, Git, and GitHub.
      Built and deployed scalable web projects.
    `);

    const chartSkillTotal = Object.values(result.skillDistribution).reduce(
      (sum, count) => sum + count,
      0
    );

    expect(chartSkillTotal).toBe(result.detectedSkills.length);
  });

  it("generates a learning roadmap for skills missing from the target job", () => {
    const resumeResult = analyzeResume(`
      React developer with JavaScript, CSS, Tailwind, and Git project experience.
    `);

    const roleResult = analyzeRoleMatch({
      targetRole: "Full Stack Developer",
      detectedSkills: resumeResult.detectedSkills,
      jobDescription:
        "Requires React, TypeScript, Node.js, REST API, PostgreSQL, Prisma, Docker, and Git."
    });

    expect(roleResult.matchScore).toBeGreaterThan(0);
    expect(roleResult.matchScore).toBeLessThan(100);
    expect(roleResult.missingRoleSkills).toEqual(
      expect.arrayContaining(["TypeScript", "Node.js", "REST API", "PostgreSQL", "Prisma", "Docker"])
    );
    expect(roleResult.suggestions[0]).toContain("Docker");
    expect(roleResult.roadmap[0]).toContain("Week 1");
  });

  it("returns a complete-match plan when the resume satisfies every detected role keyword", () => {
    const resumeResult = analyzeResume(`
      Backend developer using Node.js, Express, REST API, SQL, PostgreSQL, and Prisma.
      Built and optimized production APIs and database queries.
    `);

    const roleResult = analyzeRoleMatch({
      targetRole: "Backend Developer",
      detectedSkills: resumeResult.detectedSkills,
      jobDescription:
        "Backend role requiring Node.js, Express, REST API, SQL, PostgreSQL, and Prisma."
    });

    expect(roleResult.matchScore).toBe(100);
    expect(roleResult.missingRoleSkills).toHaveLength(0);
    expect(roleResult.roadmap).toEqual(
      expect.arrayContaining(["Tailor the resume summary to the target role and company."])
    );
  });
});
