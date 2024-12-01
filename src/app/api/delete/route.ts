import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();
    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ message: "Error deleting invoice" });
  }
}
