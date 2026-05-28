import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ResumeAnalyzer } from "@/components/dashboard/resume-analyzer";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main>
        <ResumeAnalyzer userName={session.user.name ?? "there"} />
      </main>
    </>
  );
}
