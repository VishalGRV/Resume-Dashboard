import type { SkillCategory } from "@/types/analysis";

export const skillCategories: Record<SkillCategory, string[]> = {
  frontend: ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Tailwind"],
  backend: ["Node.js", "Express", "SQL", "PostgreSQL", "MongoDB", "Prisma", "REST API"],
  devops: ["Docker", "AWS", "CI/CD", "Vercel", "GitHub Actions"],
  programming: ["Java", "Python", "C++", "C", "Data Structures", "Algorithms"],
  ai: ["TensorFlow", "PyTorch", "Machine Learning", "NLP", "Generative AI"],
  tools: ["Git", "GitHub", "Figma", "Postman", "Jira"]
};

export const coreIndustrySkills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "SQL",
  "PostgreSQL",
  "Git",
  "REST API",
  "Docker"
];

export const skillAliases: Record<string, string[]> = {
  "Next.js": ["nextjs", "next js", "next.js"],
  "Node.js": ["nodejs", "node js", "node.js"],
  "REST API": ["rest api", "restful", "api development"],
  "CI/CD": ["ci/cd", "continuous integration", "continuous deployment"],
  "GitHub Actions": ["github actions"],
  "C++": ["c++", "cpp"],
  "Data Structures": ["data structures", "dsa"],
  "Machine Learning": ["machine learning", "ml"],
  "Generative AI": ["generative ai", "gen ai"],
  "PostgreSQL": ["postgresql", "postgres"],
  "MongoDB": ["mongodb", "mongo db"]
};
