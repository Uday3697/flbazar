"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { siteAlertErrorClass, siteInputClass } from "@/lib/site-styles";

const TERMS_TEXT =
  "By creating an account, you agree that all sample packs, FLPs, loops, and digital products purchased from Flbaazar are for your personal use only. You will not resell, redistribute, share, or upload purchased files to any third party. Violation may lead to account suspension without refund.";

type Props = {
  primaryButtonClass: string;
};

export function SignupForm({ primaryButtonClass }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please add email or mobile number.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please enter the same password twice.");
      setLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions to create your account.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: form.age,
          email: form.email,
          phone: form.phone,
          password: form.password,
          confirmPassword: form.confirmPassword,
          agreeToTerms: true,
        }),
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
        setLoading(false);
        router.push("/login?success=Account+created.+Please+login");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
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
        required
        type="number"
        name="age"
        min={13}
        max={100}
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
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
      <input
        required
        type="password"
        name="confirmPassword"
        minLength={6}
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm password"
        className={siteInputClass}
      />

      <details className="rounded-2xl border border-slate-200 bg-slate-50 text-sm">
        <summary className="cursor-pointer px-4 py-3 font-semibold text-orange-600 underline-offset-2 hover:underline [&::-webkit-details-marker]:hidden">
          Terms &amp; conditions
        </summary>
        <p className="border-t border-slate-200 px-4 py-3 text-xs leading-6 text-slate-600">{TERMS_TEXT}</p>
      </details>

      <label className="flex items-start gap-3 text-sm text-slate-700">
        <input
          required
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />
        <span>I agree to the terms and conditions.</span>
      </label>

      <p className="text-xs text-slate-500">
        Add email or mobile — you can login with either later.{" "}
        <Link href="/login" className="text-orange-600 underline">Already have account?</Link>
      </p>
      <button
        type="submit"
        disabled={loading || !agreeTerms}
        className={`w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60 ${primaryButtonClass}`}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
