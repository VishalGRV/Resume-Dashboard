import { NextResponse } from "next/server";
import { createRequire } from "module";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/analyzer/analyze-resume";

export const runtime = "nodejs";

const jsonSchema = z.object({
  resumeText: z.string().min(80, "Paste at least 80 characters of resume content.")
});

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js") as (buffer: Buffer) => Promise<{ text: string }>;

async function extractPdfText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const parsed = await pdfParse(buffer);
  return parsed.text.trim();
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") ?? "";
    let resumeText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const pastedText = String(formData.get("resumeText") ?? "");
      const file = formData.get("file");

      if (file instanceof File && file.size > 0) {
        if (file.type !== "application/pdf") {
          return NextResponse.json({ error: "Only PDF uploads are supported." }, { status: 400 });
        }
        resumeText = await extractPdfText(file);
      } else {
        resumeText = pastedText;
      }
    } else {
      const body = await request.json();
      const parsed = jsonSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid resume text." }, { status: 400 });
      }
      resumeText = parsed.data.resumeText;
    }

    const parsed = jsonSchema.safeParse({ resumeText });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Resume content is too short." }, { status: 400 });
    }

    const result = analyzeResume(parsed.data.resumeText);

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        resumeText: parsed.data.resumeText,
        analysisReports: {
          create: {
            atsScore: result.atsScore,
            frontendScore: result.frontendScore,
            backendScore: result.backendScore,
            industryReadiness: result.industryReadiness,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            recommendations: result.recommendations,
            detectedSkills: result.detectedSkills,
            missingSkills: result.missingSkills,
            skillDistribution: result.skillDistribution
          }
        }
      },
      include: {
        analysisReports: true
      }
    });

    return NextResponse.json({
      resumeId: resume.id,
      report: resume.analysisReports[0]
    });
  } catch (error) {
    console.error("Resume analysis failed:", error);
    return NextResponse.json(
      {
        error:
          "Unable to analyze this resume. If it is a scanned or image-only PDF, paste the resume text instead."
      },
      { status: 500 }
    );
  }
}
