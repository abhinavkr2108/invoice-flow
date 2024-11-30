"use server";

import { requireUser } from "@/hooks/require-user";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "./zodSchema";
import prisma from "./db";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import fs from "fs";
import { transporter } from "./nodemailer";
import path from "path";

export async function createInvoice(precState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, { schema: invoiceSchema });

  const templatePath = path.join(process.cwd(), "template.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.create({
    data: {
      invoiceName: submission.value.invoiceName,
      total: submission.value.total,
      status: submission.value.status,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      invoiceNumber: submission.value.invoiceNumber,
      note: submission.value.note,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      userId: session?.user?.id,
    },
  });

  // Replace placeholders with actual values
  template = template.replace(/{{clientName}}/g, submission.value.clientName);
  template = template.replace(
    /{{invoiceNumber}}/g,
    submission.value.invoiceNumber.toString()
  );
  template = template.replace(
    /{{dueDate}}/g,
    submission.value.dueDate.toString()
  );
  template = template.replace(
    /{{totalAmount}}/g,
    submission.value.total.toString()
  );
  template = template.replace(
    /{{invoiceLink}}/g,
    `http://localhost:3000/api/invoice/${data.id}`
  );

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: submission.value.clientEmail,
      subject: "New Invoice",
      html: template,
    });
  } catch (error) {
    console.error(error);
  }

  return redirect(`/invoice`);
}
