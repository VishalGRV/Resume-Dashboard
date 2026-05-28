import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProfileView } from "@/components/profile/profile-view";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main>
        <ProfileView />
      </main>
    </>
  );
}
