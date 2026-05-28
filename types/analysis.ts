export type SkillCategory = "frontend" | "backend" | "devops" | "programming" | "ai" | "tools";

export type SkillDistribution = Record<SkillCategory, number>;

export type AnalysisResult = {
  atsScore: number;
  frontendScore: number;
  backendScore: number;
  industryReadiness: number;
  detectedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skillDistribution: SkillDistribution;
};
