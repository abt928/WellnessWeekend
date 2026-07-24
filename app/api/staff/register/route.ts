import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { staffRegistrations } from "@/lib/schema";
import { eq } from "drizzle-orm";

function generateTicketCode(): string {
  // Avoid 0/O/1/I ambiguity
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `STAFF-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      role,
      emergencyContactName,
      emergencyContactPhone,
      dietaryNeeds,
    } = body;

    // Validate required fields
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, role" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if email already registered
    const existing = await db
      .select()
      .from(staffRegistrations)
      .where(eq(staffRegistrations.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length > 0) {
      const reg = existing[0];
      return NextResponse.json(
        {
          success: true,
          alreadyRegistered: true,
          ticket: {
            name: reg.name,
            email: reg.email,
            role: reg.role,
            ticketCode: reg.ticketCode,
            createdAt: reg.createdAt,
          },
        },
        { status: 409 }
      );
    }

    const ticketCode = generateTicketCode();

    const [inserted] = await db
      .insert(staffRegistrations)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        role: role.trim(),
        emergencyContactName: emergencyContactName?.trim() || null,
        emergencyContactPhone: emergencyContactPhone?.trim() || null,
        dietaryNeeds: dietaryNeeds?.trim() || null,
        ticketCode,
      })
      .returning();

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      ticket: {
        name: inserted.name,
        email: inserted.email,
        role: inserted.role,
        ticketCode: inserted.ticketCode,
        createdAt: inserted.createdAt,
      },
    });
  } catch (e) {
    console.error("Staff registration error:", e);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ registration: null });
    }

    const db = getDb();
    const existing = await db
      .select()
      .from(staffRegistrations)
      .where(eq(staffRegistrations.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ registration: null });
    }

    const reg = existing[0];
    return NextResponse.json({
      registration: {
        name: reg.name,
        email: reg.email,
        role: reg.role,
        ticketCode: reg.ticketCode,
        createdAt: reg.createdAt,
      },
    });
  } catch (e) {
    console.error("Staff registration lookup error:", e);
    return NextResponse.json({ registration: null });
  }
}
