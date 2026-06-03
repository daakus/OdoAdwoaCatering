"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updateCustomerProfile,
  type CustomerActionState,
} from "@/app/actions/customer";

const initial: CustomerActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full rounded-full bg-stitch-primary py-4 font-bold text-stitch-on-primary shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function CustomerSettingsForm(props: {
  defaultFullName: string;
  defaultPhone: string;
  defaultAvatarUrl: string;
  email: string | null;
}) {
  const { defaultFullName, defaultPhone, defaultAvatarUrl, email } = props;
  const [state, formAction] = useFormState(updateCustomerProfile, initial);

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-8">
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-green-700">{state.success}</p> : null}

      {email ? (
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-stitch-on-surface-variant">
            Email
          </label>
          <p className="text-sm text-stitch-on-surface">{email}</p>
          <p className="mt-1 text-xs text-stitch-on-surface-variant">Email sign-in is managed by your auth provider.</p>
        </div>
      ) : null}

      <div className="group border-b-2 border-stitch-outline-variant pb-1 focus-within:border-stitch-primary">
        <label className="text-xs font-bold uppercase tracking-widest text-stitch-on-surface-variant" htmlFor="full_name">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultFullName}
          className="mt-2 w-full border-none bg-transparent text-lg text-stitch-on-surface focus:ring-0"
        />
      </div>

      <div className="group border-b-2 border-stitch-outline-variant pb-1 focus-within:border-stitch-primary">
        <label className="text-xs font-bold uppercase tracking-widest text-stitch-on-surface-variant" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={defaultPhone}
          className="mt-2 w-full border-none bg-transparent text-lg text-stitch-on-surface focus:ring-0"
          placeholder="+233 …"
        />
      </div>

      <div className="group border-b-2 border-stitch-outline-variant pb-1 focus-within:border-stitch-primary">
        <label className="text-xs font-bold uppercase tracking-widest text-stitch-on-surface-variant" htmlFor="avatar_url">
          Avatar image URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={defaultAvatarUrl}
          className="mt-2 w-full border-none bg-transparent text-lg text-stitch-on-surface focus:ring-0"
          placeholder="https://…"
        />
        <p className="mt-2 text-xs text-stitch-on-surface-variant">
          Use a public image URL (e.g. from your Supabase storage bucket).
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
