"use server";

import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models";

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

  try {
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
