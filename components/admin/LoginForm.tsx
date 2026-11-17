"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/admin/actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending} aria-busy={pending}>
      {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
      Sign in
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);
  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="input"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[14px] text-red-500">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
