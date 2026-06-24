import { describe, expect, it } from "vitest";
import { analyzeResume } from "@/lib/analyzer/analyze-resume";

describe("analysis report data flow", () => {
  it("maps analyzer output to the fields stored in an analysis report", () => {
    const analysis = analyzeResume(`
      Software developer with React, Next.js, TypeScript, Node.js, PostgreSQL,
      Prisma, Git, and Docker. Built and deployed a dashboard that improved
      reporting speed by 40%.
    `);

    const reportCreateData = {
      atsScore: analysis.atsScore,
      frontendScore: analysis.frontendScore,
      backendScore: analysis.backendScore,
      industryReadiness: analysis.industryReadiness,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendations: analysis.recommendations,
      detectedSkills: analysis.detectedSkills,
      missingSkills: analysis.missingSkills,
      skillDistribution: analysis.skillDistribution
    };

    expect(reportCreateData).toEqual(analysis);
    expect(Object.keys(reportCreateData)).toHaveLength(10);
  });

  it("keeps analyzer output JSON serializable for an API response", () => {
    const analysis = analyzeResume(`
      JavaScript and React developer who built a responsive project using
      TypeScript, Tailwind, Git, and Vercel.
    `);

    const serialized = JSON.stringify(analysis);
    const parsed = JSON.parse(serialized);

    expect(parsed).toEqual(analysis);
    expect(parsed.detectedSkills).toContain("React");
  });

  it("provides score values suitable for all four dashboard cards", () => {
    const analysis = analyzeResume(`
      Developer with HTML, CSS, JavaScript, React, Next.js, TypeScript,
      Node.js, SQL, PostgreSQL, and Git. Built and improved two projects.
    `);

    const scoreCards = [
      analysis.atsScore,
      analysis.frontendScore,
      analysis.backendScore,
      analysis.industryReadiness
    ];

    expect(scoreCards).toHaveLength(4);
    scoreCards.forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
