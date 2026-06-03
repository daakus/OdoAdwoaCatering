"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import type { RoleSlug } from "@/types";

export interface AuthActionState {
  error?: string;
  success?: string;
}

function normalizeRole(role: string | null): RoleSlug | null {
  if (role === "super_admin") return "admin";
  if (role === "admin" || role === "staff" || role === "customer") return role;
  return null;
}

export async function signInWithPassword(
  _prev: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/customer");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!email.includes("@")) {
    return {
      error: "Please sign in with the email address on your account.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: slug } = await supabase.rpc("current_role_slug", {});
  const role = normalizeRole((slug as string | null) ?? null);
  let target = next.startsWith("/") ? next : "/customer";
  const preserveForBookingPayment =
    target === "/payment-instructions" || target.startsWith("/payment-instructions?");
  if (role === "admin" && !target.startsWith("/admin") && !preserveForBookingPayment) {
    target = "/admin";
  } else if (role === "staff" && !target.startsWith("/staff") && !preserveForBookingPayment) {
    target = "/staff";
  } else if (role === "customer" && (target.startsWith("/admin") || target.startsWith("/staff"))) {
    target = "/customer";
  }

  revalidatePath("/", "layout");
  redirect(target);
}

export async function signUpWithPassword(
  _prev: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const terms = formData.get("terms");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (terms !== "on") {
    return { error: "Please accept the Terms of Service and Privacy Policy." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        ...(phone ? { phone } : {}),
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Check your email to confirm your account, then sign in.",
  };
}

export async function requestPasswordReset(
  _prev: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const raw = String(
    formData.get("identifier") ?? formData.get("email") ?? ""
  ).trim();
  const email = raw.includes("@") ? raw : "";
  if (!email) {
    return {
      error:
        "Enter the email address on your account. Password reset is sent by email only.",
    };
  }

  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/customer/settings`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "If an account exists, a reset link has been sent." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
