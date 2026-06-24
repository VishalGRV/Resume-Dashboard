import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  userCreate: vi.fn(),
  hash: vi.fn()
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: mocks.findUnique,
      create: mocks.userCreate
    }
  }
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mocks.hash
  }
}));

import { POST } from "@/app/api/signup/route";

function signupRequest(body: unknown) {
  return new Request("http://localhost/api/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findUnique.mockResolvedValue(null);
    mocks.hash.mockResolvedValue("hashed-password");
    mocks.userCreate.mockResolvedValue({
      id: "user-1",
      name: "Vishal",
      email: "vishal@example.com"
    });
  });

  it("creates a valid user and returns 201", async () => {
    const response = await POST(
      signupRequest({
        name: "Vishal",
        email: "vishal@example.com",
        password: "password123"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user).toEqual({
      id: "user-1",
      name: "Vishal",
      email: "vishal@example.com"
    });
  });

  it("rejects an invalid email address", async () => {
    const response = await POST(
      signupRequest({
        name: "Vishal",
        email: "invalid-email",
        password: "password123"
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  it("rejects a password shorter than eight characters", async () => {
    const response = await POST(
      signupRequest({
        name: "Vishal",
        email: "vishal@example.com",
        password: "short"
      })
    );

    expect(response.status).toBe(400);
    expect(mocks.hash).not.toHaveBeenCalled();
  });

  it("rejects a name shorter than two characters", async () => {
    const response = await POST(
      signupRequest({
        name: "V",
        email: "vishal@example.com",
        password: "password123"
      })
    );

    expect(response.status).toBe(400);
  });

  it("returns 409 when an account already exists", async () => {
    mocks.findUnique.mockResolvedValue({ id: "existing-user" });

    const response = await POST(
      signupRequest({
        name: "Vishal",
        email: "vishal@example.com",
        password: "password123"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toContain("already exists");
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("normalizes email to lowercase before lookup and storage", async () => {
    await POST(
      signupRequest({
        name: "Vishal",
        email: "VISHAL@EXAMPLE.COM",
        password: "password123"
      })
    );

    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { email: "vishal@example.com" }
    });
    expect(mocks.userCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "vishal@example.com"
        })
      })
    );
  });

  it("hashes the password with cost factor 12 before saving", async () => {
    await POST(
      signupRequest({
        name: "Vishal",
        email: "vishal@example.com",
        password: "password123"
      })
    );

    expect(mocks.hash).toHaveBeenCalledWith("password123", 12);
    expect(mocks.userCreate).toHaveBeenCalledWith({
      data: {
        name: "Vishal",
        email: "vishal@example.com",
        password: "hashed-password"
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  });
});
