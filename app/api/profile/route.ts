import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      resumes: {
        orderBy: { uploadedAt: "desc" },
        select: {
          id: true,
          uploadedAt: true,
          resumeText: true,
          analysisReports: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              atsScore: true,
              industryReadiness: true,
              createdAt: true
            }
          }
        }
      }
    }
  });

  return NextResponse.json({ user });
}
