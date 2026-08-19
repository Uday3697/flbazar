"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { siteAlertErrorClass, siteInputClass } from "@/lib/site-styles";

type Props = {
  primaryButtonClass: string;
};

export function LoginForm({ primaryButtonClass }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Wrong email/mobile or password");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleCredentials} className="space-y-4">
      {error ? <p className={siteAlertErrorClass}>{error}</p> : null}
      <input
        required
        name="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Mobile number or email"
        className={siteInputClass}
      />
      <input
        required
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className={siteInputClass}
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold ${primaryButtonClass}`}
      >
        {loading ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
