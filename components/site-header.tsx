"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart3, FileUser, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex size-9 items-center justify-center rounded-md bg-teal-400 text-slate-950">
            <Sparkles className="size-4" />
          </span>
          Resume IQ
        </Link>
        <nav className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                  <BarChart3 className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">
                  <FileUser className="size-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Start free</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
