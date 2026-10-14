"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Input, primaryButton } from "@/components/admin/fields";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-6 grid gap-4">
      <Input label="Email" name="email" type="email" autoComplete="username" required />
      <Input label="Password" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button disabled={pending} className={`${primaryButton} py-3`}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
