import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      uploadedAt: "desc"
    },
    include: {
      analysisReports: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  const reports = resumes.flatMap((resume) =>
    resume.analysisReports.map((report) => ({
      ...report,
      resumeId: resume.id,
      uploadedAt: resume.uploadedAt,
      preview: resume.resumeText.slice(0, 180)
    }))
  );

  return NextResponse.json({ reports });
}
