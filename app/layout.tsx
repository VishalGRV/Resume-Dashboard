import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Intelligence Dashboard",
  description: "ATS scoring, skill intelligence, and resume readiness analytics for job seekers."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen subtle-grid">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
