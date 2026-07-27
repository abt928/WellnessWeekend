import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { staffGuests, staffRegistrations } from "@/lib/schema";
import { eq } from "drizzle-orm";

function generateGuestCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `GUEST-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const { staffTicketCode, guestName, guestEmail } = await req.json();

    if (!staffTicketCode || !guestName?.trim()) {
      return NextResponse.json(
        { error: "Staff ticket code and guest name are required." },
        { status: 400 }
      );
    }

    const db = getDb();
    const upper = staffTicketCode.trim().toUpperCase();

    // Verify the staff ticket code is valid
    const [staff] = await db
      .select({ name: staffRegistrations.name, ticketCode: staffRegistrations.ticketCode })
      .from(staffRegistrations)
      .where(eq(staffRegistrations.ticketCode, upper))
      .limit(1);

    if (!staff) {
      return NextResponse.json(
        { error: "Staff ticket code not found. Double-check your code and try again." },
        { status: 404 }
      );
    }

    const ticketCode = generateGuestCode();

    const [inserted] = await db
      .insert(staffGuests)
      .values({
        staffTicketCode: upper,
        staffName: staff.name,
        guestName: guestName.trim(),
        guestEmail: guestEmail?.trim().toLowerCase() || null,
        ticketCode,
      })
      .returning();

    return NextResponse.json({
      success: true,
      ticket: {
        guestName: inserted.guestName,
        guestEmail: inserted.guestEmail,
        ticketCode: inserted.ticketCode,
        staffName: staff.name,
        staffTicketCode: upper,
        createdAt: inserted.createdAt,
      },
    });
  } catch (e) {
    console.error("Guest registration error:", e);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const staffTicketCode = req.nextUrl.searchParams.get("staffTicketCode");
    if (!staffTicketCode) {
      return NextResponse.json({ guests: [] });
    }

    const db = getDb();
    const guests = await db
      .select()
      .from(staffGuests)
      .where(eq(staffGuests.staffTicketCode, staffTicketCode.trim().toUpperCase()));

    return NextResponse.json({ guests });
  } catch (e) {
    console.error("Guest lookup error:", e);
    return NextResponse.json({ guests: [] });
  }
}
