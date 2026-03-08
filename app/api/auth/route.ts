import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured on server" },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // Create a successfully authenticated response
      const response = NextResponse.json(
        { success: true, message: "Authentication successful" },
        { status: 200 }
      );

      // Set a secure HTTP-only cookie indicating the user is an admin
      // In a real production app, this should be a signed JWT, but for a simple
      // single-user personal dashboard, a strong obscure value works.
      response.cookies.set({
        name: "admin_token",
        value: "authenticated_admin_" + Date.now(),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout route
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  // Clear the cookie by setting maxAge to 0
  response.cookies.set({
    name: "admin_token",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return response;
}
