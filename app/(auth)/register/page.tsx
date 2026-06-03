import type { Metadata } from "next";
import { RegisterEditorialForm } from "@/components/auth/register-editorial-form";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: `Join | ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { email?: string; full_name?: string; phone?: string };
}) {
  return (
    <RegisterEditorialForm
      defaultEmail={searchParams.email}
      defaultFullName={searchParams.full_name}
      defaultPhone={searchParams.phone}
    />
  );
}
