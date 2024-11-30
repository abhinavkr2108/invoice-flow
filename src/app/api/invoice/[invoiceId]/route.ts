import prisma from "@/utils/db";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/hooks/format-currency";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      invoiceName: true,
      clientName: true,
      clientAddress: true,
      clientEmail: true,
      fromName: true,
      fromAddress: true,
      fromEmail: true,
      total: true,
      status: true,
      currency: true,
      createdAt: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      note: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("helvetica");

  //header
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  //from
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("From: ", 20, 35);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    [data.fromName, data.fromAddress, data.fromEmail].join("\n"),
    20,
    40
  );

  //to
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("To: ", 20, 55);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    [data.clientName, data.clientAddress, data.clientEmail].join("\n"),
    20,
    60
  );

  //invoice details
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Invoice Details: ", 120, 30);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    [
      `Invoice Number: ${data.invoiceNumber}`,
      `Date: ${new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
        data.createdAt
      )}`,
      `Due Date: Net ${data.dueDate}`,
      `Total: ${data.total}`,
      `Currency: ${data.currency}`,
      `Status: ${data.status}`,
    ].join("\n"),
    120,
    40
  );

  //item table
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Item Details: ", 20, 80);

  autoTable(pdf, {
    head: [["Description", "Quantity", "Rate", "Amount"]],
    body: [
      [
        data.invoiceItemDescription,
        data.invoiceItemQuantity,
        data.invoiceItemRate,
        formatCurrency(data.total, data.currency),
      ],
    ],
    theme: "grid",
    styles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [211, 211, 211],
    },
    startY: 85,
  });

  //total
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total: ${formatCurrency(data.total, data.currency)}`, 150, 110);

  //notes
  if (data.note) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Note:", 20, 130);
    pdf.setFontSize(10);
    pdf.text(data.note, 20, 135);
  }

  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline`,
    },
  });
}
