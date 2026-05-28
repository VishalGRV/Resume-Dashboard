import type { AnalysisResult, SkillCategory, SkillDistribution } from "@/types/analysis";
import { coreIndustrySkills, skillAliases, skillCategories } from "./skill-data";

const allSkills = Object.values(skillCategories).flat();

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function countMatches(text: string, patterns: string[]) {
  return patterns.reduce((count, pattern) => {
    const escaped = pattern.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, "gi");
    return count + (text.match(regex)?.length ?? 0);
  }, 0);
}

function skillPatterns(skill: string) {
  return [skill.toLowerCase(), ...(skillAliases[skill] ?? [])];
}

function detectSkills(resumeText: string) {
  const normalizedText = resumeText.toLowerCase();
  return allSkills
    .filter((skill) => countMatches(normalizedText, skillPatterns(skill)) > 0)
    .sort((a, b) => a.localeCompare(b));
}

function categoryCount(category: SkillCategory, detectedSkills: string[]) {
  return skillCategories[category].filter((skill) => detectedSkills.includes(skill)).length;
}

function scoreCategory(category: SkillCategory, detectedSkills: string[]) {
  const found = categoryCount(category, detectedSkills);
  const total = skillCategories[category].length;
  return clampScore((found / total) * 100);
}

function detectProjectCount(text: string) {
  const matches = text.match(/\b(project|built|developed|implemented|created|designed|deployed)\b/gi);
  return matches?.length ?? 0;
}

function detectImpactSignals(text: string) {
  const matches = text.match(/\b(\d+%|\d+x|reduced|improved|increased|optimized|launched|automated|scalable)\b/gi);
  return matches?.length ?? 0;
}

function buildSkillDistribution(detectedSkills: string[]): SkillDistribution {
  return {
    frontend: categoryCount("frontend", detectedSkills),
    backend: categoryCount("backend", detectedSkills),
    devops: categoryCount("devops", detectedSkills),
    programming: categoryCount("programming", detectedSkills),
    ai: categoryCount("ai", detectedSkills),
    tools: categoryCount("tools", detectedSkills)
  };
}

function buildStrengths(frontendScore: number, backendScore: number, detectedSkills: string[], projectCount: number, impactSignals: number) {
  const strengths: string[] = [];

  if (frontendScore >= 55) strengths.push("Strong frontend profile with modern UI engineering skills.");
  if (backendScore >= 45) strengths.push("Solid backend foundation with database or API exposure.");
  if (detectedSkills.includes("TypeScript")) strengths.push("TypeScript experience improves maintainability and production readiness.");
  if (projectCount >= 4) strengths.push("Project-oriented resume with enough implementation signals for recruiters.");
  if (impactSignals >= 2) strengths.push("Impact language is present, which helps the resume feel outcome-driven.");
  if (detectedSkills.length >= 10) strengths.push("Broad technical skill coverage across multiple engineering areas.");

  return strengths.length > 0 ? strengths : ["Clear technical foundation with room to sharpen positioning and evidence."];
}

function buildWeaknesses(frontendScore: number, backendScore: number, missingSkills: string[], projectCount: number, impactSignals: number) {
  const weaknesses: string[] = [];

  if (frontendScore < 45) weaknesses.push("Frontend depth appears limited against common SaaS product expectations.");
  if (backendScore < 40) weaknesses.push("Backend and database exposure could be clearer.");
  if (missingSkills.includes("Git")) weaknesses.push("Version control is not visible, which is a baseline industry signal.");
  if (projectCount < 3) weaknesses.push("Resume needs more explicit project evidence and implementation verbs.");
  if (impactSignals < 2) weaknesses.push("Achievements would be stronger with measurable outcomes and scale.");

  return weaknesses.length > 0 ? weaknesses : ["Main opportunity is to make achievements more measurable and role-specific."];
}

function buildRecommendations(missingSkills: string[], frontendScore: number, backendScore: number, industryReadiness: number) {
  const recommendations: string[] = [];
  const topMissing = missingSkills.slice(0, 5);

  if (topMissing.length > 0) {
    recommendations.push(`Add or learn high-value missing skills: ${topMissing.join(", ")}.`);
  }
  if (frontendScore < 60) recommendations.push("Include a polished React or Next.js project with responsive UI, state management, and deployment.");
  if (backendScore < 60) recommendations.push("Add one API-backed project using SQL/PostgreSQL and authentication.");
  if (industryReadiness < 70) recommendations.push("Rewrite bullet points to show problem, action, technology, and measurable result.");
  recommendations.push("Tailor keywords for each job description before applying to improve ATS matching.");

  return recommendations;
}

export function analyzeResume(resumeText: string): AnalysisResult {
  const text = resumeText.trim();
  const detectedSkills = detectSkills(text);
  const missingSkills = coreIndustrySkills.filter((skill) => !detectedSkills.includes(skill));
  const projectCount = detectProjectCount(text);
  const impactSignals = detectImpactSignals(text);
  const frontendScore = scoreCategory("frontend", detectedSkills);
  const backendScore = scoreCategory("backend", detectedSkills);
  const skillDiversityScore = clampScore((detectedSkills.length / allSkills.length) * 100);
  const projectScore = clampScore(projectCount * 14);
  const impactScore = clampScore(impactSignals * 16);
  const keywordDensityScore = clampScore((detectedSkills.length / Math.max(text.split(/\s+/).length, 1)) * 420);
  const atsScore = clampScore(keywordDensityScore * 0.35 + projectScore * 0.25 + skillDiversityScore * 0.25 + impactScore * 0.15);
  const industryReadiness = clampScore(atsScore * 0.35 + frontendScore * 0.22 + backendScore * 0.22 + skillDiversityScore * 0.21);

  return {
    atsScore,
    frontendScore,
    backendScore,
    industryReadiness,
    detectedSkills,
    missingSkills,
    strengths: buildStrengths(frontendScore, backendScore, detectedSkills, projectCount, impactSignals),
    weaknesses: buildWeaknesses(frontendScore, backendScore, missingSkills, projectCount, impactSignals),
    recommendations: buildRecommendations(missingSkills, frontendScore, backendScore, industryReadiness),
    skillDistribution: buildSkillDistribution(detectedSkills)
  };
}
