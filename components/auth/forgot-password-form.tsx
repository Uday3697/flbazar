"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/lib/actions";
import { siteInputClass } from "@/lib/site-styles";

type Props = {
  primaryButtonClass: string;
};

export function ForgotPasswordForm({ primaryButtonClass }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await forgotPasswordAction(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        name="login"
        placeholder="Registered email or mobile number"
        className={siteInputClass}
      />
      <input
        required
        type="password"
        name="password"
        minLength={6}
        placeholder="New password (min 6 characters)"
        className={siteInputClass}
      />
      <input
        required
        type="password"
        name="confirmPassword"
        minLength={6}
        placeholder="Confirm new password"
        className={siteInputClass}
      />
      <p className="text-xs text-slate-500">
        Use the same email or mobile you used when creating your account.
      </p>
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold ${primaryButtonClass}`}
      >
        {loading ? "Updating…" : "Reset password"}
      </button>
    </form>
  );
}
