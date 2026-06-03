"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import type { AuthActionState } from "@/app/actions/auth";
import { signUpWithPassword } from "@/app/actions/auth";
import { AUTH_EDITORIAL_IMAGES } from "@/lib/constants/auth-editorial";
import { SITE_NAME } from "@/lib/constants/site";
import { AuthTransactionalHeader } from "@/components/auth/auth-transactional-header";
import { MaterialIcon } from "@/components/home/material-icon";

const initial: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="glow-gradient flex w-full items-center justify-center gap-3 rounded-full py-5 text-lg font-bold text-stitch-on-primary shadow-xl shadow-stitch-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      disabled={pending}
    >
      {pending ? "Creating account…" : "Sign Up"}
      <MaterialIcon name="arrow_forward" />
    </button>
  );
}

export function RegisterEditorialForm(props: {
  defaultEmail?: string;
  defaultFullName?: string;
  defaultPhone?: string;
}) {
  const { defaultEmail, defaultFullName, defaultPhone } = props;
  const [state, formAction] = useFormState(signUpWithPassword, initial);

  return (
    <div className="min-h-max min-h-dvh bg-stitch-background text-stitch-on-background selection:bg-stitch-primary-fixed selection:text-stitch-on-primary-fixed">
      <AuthTransactionalHeader layout="balanced" />

      <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-12 px-6 pb-12 pt-24 md:flex-row">
        <div className="relative hidden w-1/2 flex-col md:flex">
          <div className="relative z-10">
            <p className="mb-6 font-label text-xs uppercase tracking-[0.2em] text-stitch-secondary">
              Traditional Taste, Quality & Satisfaction
            </p>
            <h2 className="mb-8 font-headline text-6xl leading-[1.1] tracking-tight text-stitch-on-surface lg:text-7xl">
              Discover your <br /> <span className="font-normal italic">inner glow.</span>
            </h2>
            <div className="mb-8 h-1 w-24 bg-stitch-primary" />
            <p className="max-w-md text-lg font-light leading-relaxed text-stitch-on-surface-variant">
              Step into a world where beauty meets intention. Join our exclusive circle for
              curated services and bespoke treatments.
            </p>
          </div>
          <div className="absolute -bottom-20 -right-10 z-0 h-[500px] w-80 rotate-3 overflow-hidden rounded-t-full opacity-80 shadow-2xl">
            <Image
              src={AUTH_EDITORIAL_IMAGES.registerSanctuary}
              alt="Beauty sanctuary interior"
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        </div>

        <div className="w-full max-w-lg md:w-1/2">
          <div className="relative overflow-hidden rounded-[2rem] border border-stitch-outline-variant/10 bg-stitch-surface-container-low p-8 shadow-sm md:p-12">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-stitch-primary-fixed/30 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-stitch-secondary-fixed/30 blur-3xl" />

            <div className="relative z-10 mb-10">
              <h3 className="mb-2 font-headline text-3xl text-stitch-on-surface">Create Account</h3>
              <p className="font-light text-stitch-on-surface-variant">
                Join {SITE_NAME} for a premium experience.
              </p>
            </div>

            <form action={formAction} className="relative z-10 space-y-8">
              {state.error ? (
                <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
              ) : null}
              {state.success ? (
                <p className="text-sm text-emerald-700 dark:text-emerald-400">{state.success}</p>
              ) : null}

              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stitch-secondary"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  placeholder="Evelyn Thorne"
                  defaultValue={defaultFullName ?? ""}
                  className="w-full border-0 border-x-0 border-b-2 border-stitch-outline-variant bg-transparent py-3 px-0 text-lg font-light text-stitch-on-surface placeholder:text-stone-300 transition-colors focus:border-stitch-primary focus:ring-0"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stitch-secondary"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="evelyn@radiance.com"
                  defaultValue={defaultEmail ?? ""}
                  className="w-full border-0 border-x-0 border-b-2 border-stitch-outline-variant bg-transparent py-3 px-0 text-lg font-light text-stitch-on-surface placeholder:text-stone-300 transition-colors focus:border-stitch-primary focus:ring-0"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stitch-secondary"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+233 XX XXX XXXX"
                  defaultValue={defaultPhone ?? ""}
                  className="w-full border-0 border-x-0 border-b-2 border-stitch-outline-variant bg-transparent py-3 px-0 text-lg font-light text-stitch-on-surface placeholder:text-stone-300 transition-colors focus:border-stitch-primary focus:ring-0"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-xs font-semibold uppercase tracking-widest text-stitch-secondary"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full border-0 border-x-0 border-b-2 border-stitch-outline-variant bg-transparent py-3 px-0 text-lg font-light text-stitch-on-surface placeholder:text-stone-300 transition-colors focus:border-stitch-primary focus:ring-0"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 cursor-pointer rounded-md border-stitch-outline-variant accent-stitch-primary focus:ring-stitch-primary/20"
                  />
                </div>
                <label className="cursor-pointer text-sm leading-tight text-stitch-on-surface-variant" htmlFor="terms">
                  I agree to the{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-stitch-secondary underline decoration-stitch-outline-variant underline-offset-4 transition-all hover:decoration-stitch-secondary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/contact"
                    className="font-semibold text-stitch-secondary underline decoration-stitch-outline-variant underline-offset-4 transition-all hover:decoration-stitch-secondary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <div className="pt-4">
                <SubmitButton />
              </div>
            </form>

            <div className="relative z-10 mt-10 text-center">
              <p className="font-light text-stitch-on-surface-variant">
                Already have a sanctuary?{" "}
                <Link href="/login" className="ml-1 font-bold text-stitch-primary transition-opacity hover:opacity-70">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed left-[5%] top-[20%] -z-10 h-64 w-64 rounded-full border border-stitch-primary/10" />
      <div className="pointer-events-none fixed bottom-[10%] right-[2%] -z-10 h-96 w-96 rounded-full border border-stitch-secondary/5" />
    </div>
  );
}
