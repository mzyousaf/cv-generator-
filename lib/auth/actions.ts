"use server";

import { signOut } from "@/auth";
import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models";
import { RATE_LIMITED_MESSAGE, RATE_LIMITS } from "@/lib/rate-limit";
import { clientIp, enforceRateLimit } from "@/lib/rate-limit-server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RegisterUserState = {
  error?: string;
  success?: boolean;
};

export async function registerUser(
  _prevState: RegisterUserState,
  formData: FormData,
): Promise<RegisterUserState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (name.length > 100 || email.length > 254 || password.length > 128) {
    return { error: "Name, email or password is too long." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    const limit = await enforceRateLimit(RATE_LIMITS.signupIp, await clientIp());
    if (!limit.ok) {
      return { error: RATE_LIMITED_MESSAGE };
    }

    await connectToDatabase();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = await hashPassword(password);
    await UserModel.create({ name, email, passwordHash });

    return { success: true };
  } catch {
    return { error: "Could not create account. Please try again." };
  }
}

export async function signOutUserAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
