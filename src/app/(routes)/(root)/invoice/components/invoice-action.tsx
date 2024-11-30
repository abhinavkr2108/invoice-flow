import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircleIcon,
  DownloadCloudIcon,
  EyeIcon,
  MailIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

interface InvoiceActionProps {
  invoiceId: string;
}
export default function InvoiceAction({ invoiceId }: InvoiceActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"secondary"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="cursor-pointer">
        <DropdownMenuItem className="cursor-pointer">
          <MailIcon />
          Send Reminder Email
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/invoice/${invoiceId}`}>
            <PencilIcon />
            Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <DownloadCloudIcon />
          Download Invoice
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <CheckCircleIcon />
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-red-500">
          <Trash2Icon />
          Delete Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
