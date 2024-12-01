import { requireUser } from "@/hooks/require-user";
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();
    const session = await requireUser();
    await prisma.invoice.update({
      where: {
        id: invoiceId,
        userId: session?.user?.id,
      },
      data: {
        status: "PAID",
      },
    });
    return NextResponse.json({ message: "Invoice marked as paid" });
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    return NextResponse.json({ message: "Error marking invoice as paid" });
  }
}
