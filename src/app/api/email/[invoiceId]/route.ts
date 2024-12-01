import { requireUser } from "@/hooks/require-user";
import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { transporter } from "@/utils/nodemailer";

export async function POST(
  request: Request,

  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const session = await requireUser();
  const { invoiceId } = await params;
  console.log("invoiceID", invoiceId);

  try {
    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session?.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const templatePath = path.join(process.cwd(), "template.html");
    let template = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders with actual values
    template = template.replace(/{{clientName}}/g, invoiceData.clientName);
    template = template.replace(
      /{{invoiceNumber}}/g,
      invoiceData.invoiceNumber.toString()
    );
    template = template.replace(/{{dueDate}}/g, invoiceData.dueDate.toString());
    template = template.replace(
      /{{totalAmount}}/g,
      invoiceData.total.toString()
    );
    template = template.replace(
      /{{invoiceLink}}/g,
      `http://localhost:3000/api/invoice/${invoiceData.id}`
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: invoiceData.clientEmail,
      subject: "Reminder: Invoice Due",
      html: template,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
