import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/data-store";
import { hashPassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");
    const confirmPassword = String(body.confirmPassword || "");
    const agreeToTerms = Boolean(body.agreeToTerms);
    const ageRaw = Number(body.age);

    if (!name || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Name and password (min 6 characters) are required" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: "You must agree to the terms and conditions" },
        { status: 400 },
      );
    }

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or mobile number is required" },
        { status: 400 },
      );
    }

    if (!ageRaw || ageRaw < 13 || ageRaw > 100) {
      return NextResponse.json(
        { error: "Please enter a valid age (13–100)" },
        { status: 400 },
      );
    }

    const user = await createUser({
      name,
      age: ageRaw,
      email: email || undefined,
      phone: phone || undefined,
      passwordHash: hashPassword(password),
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
