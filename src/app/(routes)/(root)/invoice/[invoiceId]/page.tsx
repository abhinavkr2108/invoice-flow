import { requireUser } from "@/hooks/require-user";
import prisma from "@/utils/db";
import { notFound } from "next/navigation";
import React from "react";
import EditInvoice from "./components/edit-invoice";

async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

type Params = Promise<{ invoiceId: string }>;

export default async function EditInvoicePage({ params }: { params: Params }) {
  const id = await params;
  const invoiceId = id.invoiceId;
  const session = await requireUser();

  const data = await getData(invoiceId, session?.user?.id as string);

  return (
    <div>
      <EditInvoice data={data} />
    </div>
  );
}
