import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/hooks/format-currency";
import { requireUser } from "@/hooks/require-user";
import prisma from "@/utils/db";
import { UserIcon } from "lucide-react";
import React from "react";

async function getInvoices(userId: string) {
  const invoiceData = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      currency: true,
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return invoiceData;
}
export default async function RecentInvoices() {
  const session = await requireUser();

  const data = await getInvoices(session?.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((invoice) => (
          <div
            className="flex items-center justify-between mb-3"
            key={invoice.id}
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-md font-semibold">{invoice.clientName}</p>
                <div className="text-sm text-muted-foreground">
                  {invoice.clientEmail}
                </div>
              </div>
            </div>
            <div>+{formatCurrency(invoice.total, invoice.currency)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
