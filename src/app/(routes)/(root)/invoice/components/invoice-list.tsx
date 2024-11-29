import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InvoiceAction from "./invoice-action";
import prisma from "@/utils/db";
import { requireUser } from "@/hooks/require-user";
import { Badge } from "@/components/ui/badge";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      clientName: true,
      total: true,
      status: true,
      currency: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}
export default async function InvoiceList() {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>InvoiceId</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {formatCurrency(invoice.total, invoice.currency)}
            </TableCell>
            <TableCell>
              <Badge>{invoice.status}</Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                invoice.createdAt
              )}
            </TableCell>
            <TableCell className="text-right">
              <InvoiceAction />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
