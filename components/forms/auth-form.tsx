"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Unable to create account.");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error) throw new Error("Invalid email or password.");

      router.push(searchParams.get("callbackUrl") ?? "/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{isSignup ? "Create your workspace" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignup ? "Start analyzing resumes with a database-backed dashboard." : "Login to view saved analyses and recommendations."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="Vishal Sharma" />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} placeholder="Minimum 8 characters" />
          </div>
          {error ? <p className="rounded-md border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSignup ? "Create account" : "Login"}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account?" : "New to Resume IQ?"}{" "}
          <Link className="font-medium text-teal-300 hover:text-teal-200" href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Login" : "Create account"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
