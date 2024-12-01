import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Graph from "./graph";
import prisma from "@/utils/db";
import { requireUser } from "@/hooks/require-user";

async function getInvoices(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
      status: "PAID",
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group invoices by date. Amount recieved on same day will be added
  const aggregatedData = data.reduce(
    (acc: { [key: string]: number }, invoice) => {
      const date = new Date(invoice.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + invoice.total;
      return acc;
    },
    {}
  );

  // Convert the aggregated data to an array of objects
  const formattedData = Object.entries(aggregatedData) // Converts in 2d-array
    .map(([date, amount]) => ({
      // map over each item of 2d-array. Each item is an array of [date, amount]
      date: date,
      amount: amount,
      originalDate: new Date(date + " , " + new Date().getFullYear()),
    })) // returns a new array of objects (array of [date, amount] converted to object {date, amount})
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map((item) => ({
      date: item.date,
      amount: item.amount,
    }));

  return formattedData;
}
export default async function DashboardGraph() {
  const session = await requireUser();
  const data = await getInvoices(session?.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Total invoices which have been paid till now
        </CardDescription>
        <CardContent>
          <Graph data={data} />
        </CardContent>
      </CardHeader>
    </Card>
  );
}
