"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import type { AuthActionState } from "@/app/actions/auth";
import { signInWithPassword } from "@/app/actions/auth";
import { AUTH_EDITORIAL_IMAGES } from "@/lib/constants/auth-editorial";
import { SITE_NAME } from "@/lib/constants/site";
import { AuthTransactionalHeader } from "@/components/auth/auth-transactional-header";
import { MaterialIcon } from "@/components/home/material-icon";
import { cn } from "@/lib/utils";

const initial: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="glow-gradient w-full rounded-full py-5 text-lg font-bold tracking-wide text-stitch-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95"
      disabled={pending}
    >
      {pending ? "Signing in…" : "Login to your account"}
    </button>
  );
}

export function LoginEditorialForm(props: { next: string; urlError?: string; defaultEmail?: string }) {
  const { next, urlError, defaultEmail } = props;
  const [state, formAction] = useFormState(signInWithPassword, initial);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-max min-h-dvh flex-col items-center bg-stitch-background text-stitch-on-background selection:bg-stitch-primary-fixed">
      <AuthTransactionalHeader layout="inline" />

      <main className="flex w-full max-w-6xl flex-grow flex-col items-center justify-center gap-12 px-6 pb-12 pt-24 md:flex-row md:gap-24">
        <div className="relative hidden md:block md:w-1/2">
          <div className="absolute -right-12 -top-12 -z-0 h-48 w-48 rounded-full bg-stitch-secondary-container/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 -z-0 h-64 w-64 rounded-full bg-stitch-primary-fixed/30 blur-3xl" />
          <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
            <Image
              src={AUTH_EDITORIAL_IMAGES.loginHero}
              alt="Ghanaian food catering"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stitch-primary/40 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <h2 className="font-headline text-4xl font-bold leading-tight tracking-tighter text-stitch-on-primary">
                Quality Ghanaian Food, Delivered with Care.
              </h2>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col md:w-5/12">
          <div className="mb-12">
            <h1 className="mb-4 font-headline text-5xl tracking-tighter text-stitch-on-surface md:text-6xl">
              Welcome
            </h1>
            <p className="font-body text-lg leading-relaxed text-stitch-on-surface-variant">
              Log in to {SITE_NAME} to manage your orders and event bookings.
            </p>
          </div>

          <form action={formAction} className="space-y-8">
            <input type="hidden" name="next" value={next} />
            {urlError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
            ) : null}
            {state.error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
            ) : null}

            <div className="group relative border-b-2 border-stitch-outline-variant transition-colors duration-300 focus-within:border-stitch-primary">
              <label
                className="mb-1 block font-label text-xs uppercase tracking-[0.1rem] text-stitch-on-surface-variant"
                htmlFor="email"
              >
                Email or Phone
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                required
                placeholder="hello@odoadwoacatering.com"
                defaultValue={defaultEmail ?? ""}
                className="block w-full border-none bg-transparent px-0 py-3 text-lg text-stitch-on-surface placeholder:text-stone-400 focus:ring-0"
              />
            </div>

            <div className="group relative border-b-2 border-stitch-outline-variant transition-colors duration-300 focus-within:border-stitch-primary">
              <div className="flex items-end justify-between">
                <label
                  className="mb-1 block font-label text-xs uppercase tracking-[0.1rem] text-stitch-on-surface-variant"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="mb-1 text-xs font-bold uppercase tracking-widest text-stitch-secondary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full border-none bg-transparent py-3 pl-0 pr-10 text-lg text-stitch-on-surface placeholder:text-stone-400 focus:ring-0"
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-stitch-on-surface-variant transition-colors hover:text-stitch-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <MaterialIcon name={showPassword ? "visibility_off" : "visibility"} />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>

          <div className="my-12 flex items-center gap-4">
            <div className="h-px flex-grow bg-stitch-outline-variant/30" />
            <span className="font-label text-xs uppercase tracking-widest text-stitch-on-surface-variant">
              Or continue with
            </span>
            <div className="h-px flex-grow bg-stitch-outline-variant/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              disabled
              className={cn(
                "flex items-center justify-center gap-3 rounded-full border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest py-4",
                "cursor-not-allowed opacity-55"
              )}
              title="Coming soon"
            >
              <MaterialIcon name="google" className="text-xl" />
              <span className="font-label text-sm font-semibold tracking-wider">Google</span>
            </button>
            <button
              type="button"
              disabled
              className={cn(
                "flex items-center justify-center gap-3 rounded-full border border-stitch-outline-variant/15 bg-stitch-surface-container-lowest py-4",
                "cursor-not-allowed opacity-55"
              )}
              title="Coming soon"
            >
              <MaterialIcon name="ios" filled className="text-xl" />
              <span className="font-label text-sm font-semibold tracking-wider">Apple</span>
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="font-body text-stitch-on-surface-variant">
              New here?{" "}
              <Link href="/register" className="ml-1 font-bold text-stitch-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="flex w-full max-w-6xl flex-col items-center justify-between px-6 py-12 font-label text-xs uppercase tracking-[0.2rem] text-stitch-on-surface-variant opacity-60 md:flex-row">
        <div className="mb-4 md:mb-0">
          {SITE_NAME} © {new Date().getFullYear()}
        </div>
        <div className="flex gap-8">
          <Link href="/contact" className="transition-colors hover:text-stitch-primary">
            Privacy
          </Link>
          <Link href="/contact" className="transition-colors hover:text-stitch-primary">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-stitch-primary">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
}
