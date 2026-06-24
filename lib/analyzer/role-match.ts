import type { RoleMatchResult } from "@/types/analysis";
import { skillAliases, skillCategories } from "./skill-data";

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

function detectJobSkills(jobDescription: string) {
  const normalizedText = jobDescription.toLowerCase();
  return allSkills
    .filter((skill) => countMatches(normalizedText, skillPatterns(skill)) > 0)
    .sort((a, b) => a.localeCompare(b));
}

function buildSuggestions(targetRole: string, missingRoleSkills: string[]) {
  const roleLabel = targetRole.trim() || "this role";
  const topMissing = missingRoleSkills.slice(0, 5);
  const suggestions: string[] = [];

  if (topMissing.length > 0) {
    suggestions.push(`Add project or experience bullets showing ${topMissing.join(", ")} for ${roleLabel}.`);
    suggestions.push(`Include the missing keywords naturally in skills, projects, or experience sections.`);
  }

  suggestions.push("Rewrite 2-3 resume bullets using action verbs, technology used, and measurable outcome.");
  suggestions.push("Keep the strongest role-matching projects near the top of the resume.");

  return suggestions;
}

function buildRoadmap(missingRoleSkills: string[]) {
  const focusSkills = missingRoleSkills.slice(0, 4);

  if (focusSkills.length === 0) {
    return [
      "Tailor the resume summary to the target role and company.",
      "Add measurable outcomes to the strongest matching projects.",
      "Prepare interview stories around the matched skills already present."
    ];
  }

  return [
    `Week 1: Learn or revise fundamentals for ${focusSkills.slice(0, 2).join(" and ")}.`,
    "Week 2: Build a small role-specific project that demonstrates the missing skills.",
    "Week 3: Add the project to the resume with measurable impact and deployment details.",
    "Week 4: Practice interview explanations for the new project and update keywords for the target job post."
  ];
}

export function analyzeRoleMatch({
  targetRole,
  jobDescription,
  detectedSkills
}: {
  targetRole: string;
  jobDescription: string;
  detectedSkills: string[];
}): RoleMatchResult {
  const jobSkills = detectJobSkills(jobDescription);
  const matchedSkills = jobSkills.filter((skill) => detectedSkills.includes(skill));
  const missingRoleSkills = jobSkills.filter((skill) => !detectedSkills.includes(skill));
  const matchScore = jobSkills.length > 0 ? clampScore((matchedSkills.length / jobSkills.length) * 100) : 0;
  const roleLabel = targetRole.trim() || "the selected role";

  const summary =
    jobSkills.length === 0
      ? "The job post does not contain enough recognizable technical keywords. Add a more detailed job description for better matching."
      : `Your resume matches ${matchedSkills.length} of ${jobSkills.length} detected role keywords for ${roleLabel}.`;

  return {
    targetRole: roleLabel,
    matchScore,
    matchedSkills,
    missingRoleSkills,
    suggestions: buildSuggestions(roleLabel, missingRoleSkills),
    roadmap: buildRoadmap(missingRoleSkills),
    summary
  };
}
