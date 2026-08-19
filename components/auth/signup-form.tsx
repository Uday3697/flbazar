"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { siteAlertErrorClass, siteInputClass } from "@/lib/site-styles";

type Props = {
  primaryButtonClass: string;
};

export function SignupForm({ primaryButtonClass }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      const login = form.email || form.phone;
      const signInResult = await signIn("credentials", {
        login,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login?success=Account+created.+Please+login");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <p className={siteAlertErrorClass}>{error}</p> : null}
      <input
        required
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        className={siteInputClass}
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email (optional if mobile added)"
        className={siteInputClass}
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Mobile number (optional if email added)"
        className={siteInputClass}
      />
      <input
        required
        type="password"
        name="password"
        minLength={6}
        value={form.password}
        onChange={handleChange}
        placeholder="Password (min 6 characters)"
        className={siteInputClass}
      />
      <p className="text-xs text-slate-500">
        Add email or mobile — you can login with either later.{" "}
        <Link href="/login" className="text-orange-600 underline">Already have account?</Link>
      </p>
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold ${primaryButtonClass}`}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
