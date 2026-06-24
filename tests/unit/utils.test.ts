import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("joins static class names", () => {
    expect(cn("rounded-md", "bg-slate-900")).toBe("rounded-md bg-slate-900");
  });

  it("removes false conditional class values", () => {
    expect(cn("text-sm", false && "hidden", undefined, "font-medium")).toBe("text-sm font-medium");
  });

  it("merges conflicting Tailwind classes by keeping the latest value", () => {
    expect(cn("px-2", "px-4", "text-red-500", "text-teal-500")).toBe("px-4 text-teal-500");
  });
});
