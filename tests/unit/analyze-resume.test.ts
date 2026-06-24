import { describe, expect, it } from "vitest";
import { analyzeResume } from "@/lib/analyzer/analyze-resume";

describe("analyzeResume", () => {
  it("detects technical skills and creates score output for a strong full-stack resume", () => {
    const result = analyzeResume(`
      Frontend Developer with React, Next.js, TypeScript, Tailwind, JavaScript, Git, and GitHub experience.
      Built and deployed multiple projects using Node.js, REST API, PostgreSQL, Prisma, and Vercel.
      Improved dashboard performance by 30% and automated CI/CD using GitHub Actions.
    `);

    expect(result.detectedSkills).toEqual(
      expect.arrayContaining(["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "PostgreSQL", "Prisma", "GitHub Actions"])
    );
    expect(result.atsScore).toBeGreaterThan(40);
    expect(result.frontendScore).toBeGreaterThan(50);
    expect(result.backendScore).toBeGreaterThan(40);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("calculates a high frontend score when modern frontend skills are present", () => {
    const result = analyzeResume(`
      React developer skilled in HTML, CSS, JavaScript, TypeScript, Next.js, and Tailwind.
      Built responsive SaaS dashboards and deployed projects with GitHub.
    `);

    expect(result.frontendScore).toBeGreaterThanOrEqual(85);
    expect(result.skillDistribution.frontend).toBeGreaterThanOrEqual(6);
    expect(result.strengths).toEqual(expect.arrayContaining(["Strong frontend profile with modern UI engineering skills."]));
  });

  it("calculates backend readiness from backend and database keywords", () => {
    const result = analyzeResume(`
      Backend developer with Node.js, Express, REST API, SQL, PostgreSQL, MongoDB, and Prisma.
      Created scalable APIs and optimized database queries for production projects.
    `);

    expect(result.backendScore).toBe(100);
    expect(result.detectedSkills).toEqual(expect.arrayContaining(["Node.js", "Express", "REST API", "SQL", "PostgreSQL", "MongoDB", "Prisma"]));
    expect(result.strengths).toEqual(expect.arrayContaining(["Solid backend foundation with database or API exposure."]));
  });

  it("detects aliases such as nextjs, nodejs, postgres, and ci/cd", () => {
    const result = analyzeResume(`
      Worked with nextjs, nodejs, postgres, and ci/cd pipelines.
      Built APIs and deployed production-ready applications.
    `);

    expect(result.detectedSkills).toEqual(expect.arrayContaining(["Next.js", "Node.js", "PostgreSQL", "CI/CD"]));
  });

  it("reports missing industry skills for a limited resume", () => {
    const result = analyzeResume("Student developer with HTML and CSS project experience.");

    expect(result.detectedSkills).toEqual(expect.arrayContaining(["HTML", "CSS"]));
    expect(result.missingSkills).toEqual(expect.arrayContaining(["TypeScript", "React", "SQL", "Git"]));
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });

  it("adds weakness when project evidence is limited", () => {
    const result = analyzeResume("I know JavaScript, React, and CSS.");

    expect(result.weaknesses).toEqual(expect.arrayContaining(["Resume needs more explicit project evidence and implementation verbs."]));
  });

  it("keeps all generated scores inside the 0 to 100 range", () => {
    const result = analyzeResume(`
      React React React React TypeScript TypeScript Node.js SQL PostgreSQL Prisma Git GitHub Docker AWS.
      Built, developed, implemented, created, designed, deployed and improved products by 50%.
    `);

    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
    expect(result.frontendScore).toBeGreaterThanOrEqual(0);
    expect(result.frontendScore).toBeLessThanOrEqual(100);
    expect(result.backendScore).toBeGreaterThanOrEqual(0);
    expect(result.backendScore).toBeLessThanOrEqual(100);
    expect(result.industryReadiness).toBeGreaterThanOrEqual(0);
    expect(result.industryReadiness).toBeLessThanOrEqual(100);
  });
});
