import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import InvoiceList from "./components/invoice-list";
import { requireUser } from "@/hooks/require-user";

export default async function InvoicePage() {
  const session = await requireUser();

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Invoice</CardTitle>
              <CardDescription>Manage your invoices right here</CardDescription>
            </div>
            <Link href={"/invoice/create"}>
              <Button>
                {" "}
                <PlusCircle className="mr-1" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList />
        </CardContent>
      </Card>
    </div>
  );
}
