import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/hooks/require-user";
import prisma from "@/utils/db";
import { BookOpen, CreditCard, DollarSign, Users } from "lucide-react";
import React, { Suspense } from "react";

async function getData(userId: string) {
  const [total, paidInvoices, pendingInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
  ]);

  return { total, paidInvoices, pendingInvoices };
}
export default async function DashBoardBlocks() {
  const session = await requireUser();
  const { total, paidInvoices, pendingInvoices } = await getData(
    session?.user?.id as string
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-6">
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {total.reduce((acc, invoice) => acc + invoice.total, 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Based on last 30 days
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Invoices Issued</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">+{total.length}</div>
            <p className="text-sm text-muted-foreground">
              Total Invoices which have been issued
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Paid Invoices</CardTitle>
            <CreditCard className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">+{paidInvoices.length}</div>
            <p className="text-sm text-muted-foreground">
              Total Invoices which have been paid
            </p>
          </CardContent>
        </Card>
      </Suspense>
      <Suspense fallback={<Skeleton className="h-full w-full" />}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Open Invoices</CardTitle>
            <BookOpen className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">+{pendingInvoices.length}</div>
            <p className="text-sm text-muted-foreground">
              Total invoices which have not been paid
            </p>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
