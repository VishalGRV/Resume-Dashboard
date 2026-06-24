import { describe, expect, it } from "vitest";
import { coreIndustrySkills, skillAliases, skillCategories } from "@/lib/analyzer/skill-data";

describe("skill data", () => {
  it("contains the expected skill categories used by dashboard charts", () => {
    expect(Object.keys(skillCategories).sort()).toEqual(["ai", "backend", "devops", "frontend", "programming", "tools"]);
  });

  it("keeps frontend skills aligned with the project technology stack", () => {
    expect(skillCategories.frontend).toEqual(expect.arrayContaining(["React", "Next.js", "TypeScript", "Tailwind"]));
  });

  it("keeps backend skills aligned with database-backed application requirements", () => {
    expect(skillCategories.backend).toEqual(expect.arrayContaining(["Node.js", "SQL", "PostgreSQL", "Prisma", "REST API"]));
  });

  it("defines common industry skills used for missing-skill recommendations", () => {
    expect(coreIndustrySkills).toEqual(expect.arrayContaining(["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "SQL", "PostgreSQL", "Git"]));
  });

  it("defines aliases for common keyword variations in resumes and job descriptions", () => {
    expect(skillAliases["Next.js"]).toEqual(expect.arrayContaining(["nextjs", "next js"]));
    expect(skillAliases["PostgreSQL"]).toEqual(expect.arrayContaining(["postgres"]));
    expect(skillAliases["Machine Learning"]).toEqual(expect.arrayContaining(["ml"]));
  });
});
