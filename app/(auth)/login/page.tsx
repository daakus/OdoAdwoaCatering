import type { Metadata } from "next";
import { LoginEditorialForm } from "@/components/auth/login-editorial-form";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Sign in | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; email?: string };
}) {
  return (
    <LoginEditorialForm
      next={searchParams.next ?? "/customer"}
      urlError={searchParams.error}
      defaultEmail={searchParams.email}
    />
  );
}
