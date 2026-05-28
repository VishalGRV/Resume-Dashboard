import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/components/forms/auth-form";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-4rem)] items-center px-4 py-12">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </main>
    </>
  );
}
