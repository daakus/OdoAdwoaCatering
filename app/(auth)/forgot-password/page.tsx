import type { Metadata } from "next";
import { ForgotPasswordEditorialForm } from "@/components/auth/forgot-password-editorial-form";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Restore access | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordEditorialForm />;
}
