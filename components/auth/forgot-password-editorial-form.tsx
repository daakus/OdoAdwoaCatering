"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { AuthActionState } from "@/app/actions/auth";
import { requestPasswordReset } from "@/app/actions/auth";
import { AUTH_EDITORIAL_IMAGES } from "@/lib/constants/auth-editorial";
import { AuthTransactionalHeader } from "@/components/auth/auth-transactional-header";

const initial: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="glow-gradient w-full rounded-full py-5 font-body font-bold text-stitch-on-primary shadow-[0_8px_24px_rgba(150,68,12,0.15)] transition-all hover:opacity-90 active:scale-[0.98]"
      disabled={pending}
    >
      {pending ? "Sending…" : "Send Reset Link"}
    </button>
  );
}

export function ForgotPasswordEditorialForm() {
  const [state, formAction] = useFormState(requestPasswordReset, initial);

  return (
    <div className="flex min-h-dvh flex-col bg-stitch-background text-stitch-on-background">
      <AuthTransactionalHeader layout="balanced" />

      <main className="flex flex-grow items-center justify-center px-6 pb-12 pt-24">
        <div className="flex w-full max-w-md flex-col gap-12">
          <section className="text-center">
            <h1 className="mb-6 font-headline text-5xl tracking-tighter text-stitch-primary md:text-6xl">
              Restore <br />
              Access
            </h1>
            <p className="px-4 text-lg font-light leading-relaxed text-stitch-on-surface-variant">
              Enter the email address associated with your sanctuary account.
            </p>
          </section>

          <div className="relative overflow-hidden rounded-[2rem] bg-stitch-surface-container-low p-8 shadow-sm md:p-10">
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-stitch-primary-fixed/20 blur-3xl" />
            <form action={formAction} className="relative z-10 space-y-10">
              {state.error ? (
                <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
              ) : null}
              {state.success ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
              ) : null}
              <div className="space-y-1">
                <label
                  className="font-label text-xs uppercase tracking-widest text-stitch-outline"
                  htmlFor="identifier"
                >
                  Email or Phone Number
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="email"
                  placeholder="e.g. helena@radiance.com"
                  className="w-full border-0 border-b-2 border-stitch-outline-variant bg-transparent py-4 px-0 text-lg text-stitch-on-surface placeholder:text-stone-300 transition-colors focus:border-stitch-primary focus:ring-0"
                />
              </div>
              <div className="pt-4">
                <SubmitButton />
              </div>
            </form>
          </div>

          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2rem]">
            <Image
              src={AUTH_EDITORIAL_IMAGES.forgotTexture}
              alt=""
              fill
              className="object-cover opacity-40 mix-blend-multiply grayscale"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stitch-background via-transparent to-transparent" />
          </div>

          <footer className="flex flex-col items-center gap-6">
            <Link
              href="/login"
              className="group flex items-center gap-2 font-bold text-stitch-secondary transition-colors hover:text-stitch-primary"
            >
              <span className="border-b border-transparent transition-all group-hover:border-stitch-primary">
                Back to Login
              </span>
            </Link>
            <div className="flex items-center gap-4 text-stitch-outline-variant">
              <span className="h-px w-8 bg-stitch-outline-variant/30" />
              <span className="font-label text-[10px] uppercase tracking-[0.2em]">
                Support Sanctuary
              </span>
              <span className="h-px w-8 bg-stitch-outline-variant/30" />
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
