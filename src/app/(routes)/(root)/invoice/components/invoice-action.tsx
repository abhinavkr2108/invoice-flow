"use client";
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
import toast from "react-hot-toast";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { deleteInvoice } from "@/utils/actions";
import { useRouter } from "next/navigation";

interface InvoiceActionProps {
  invoiceId: string;
  status: string;
}
export default function InvoiceAction({
  invoiceId,
  status,
}: InvoiceActionProps) {
  const router = useRouter();
  const handleSendReminderEmail = () => {
    toast.promise(axios.post(`/api/email/${invoiceId}`), {
      loading: "Sending email...",
      success: "Email sent successfully",
      error: "Failed to send email",
    });
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const response = await axios.post(`/api/delete/`, { invoiceId });
      router.refresh();
      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error("Error deleting invoice");
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const response = await axios.post(`/api/paid/`, { invoiceId });
      router.refresh();
      toast.success("Invoice marked as paid");
    } catch (error) {
      toast.error("Error marking invoice as paid");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"secondary"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSendReminderEmail}>
          <MailIcon />
          Send Reminder Email
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/invoice/${invoiceId}`}>
            <PencilIcon />
            Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/api/invoice/${invoiceId}`} target="_blank">
            <div className="flex items-center gap-1">
              <DownloadCloudIcon />
              Download Invoice
            </div>
          </Link>
        </DropdownMenuItem>

        {status !== "PAID" && (
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <Dialog>
              <DialogTrigger>
                <div className="flex items-center gap-1">
                  <CheckCircleIcon />
                  Mark as Paid
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold">
                    Mark as Paid
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Are you sure you want to mark this invoice as paid?
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={() => handleMarkAsPaid(invoiceId)}>
                    Mark as Paid
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-red-500"
          onSelect={(event) => event.preventDefault()}
        >
          <Dialog>
            <DialogTrigger>
              <div className="flex items-center gap-1">
                <Trash2Icon />
                Delete Invoice
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  Delete Invoice
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Are you sure you want to delete this invoice?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDeleteInvoice(invoiceId)}
                  >
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
