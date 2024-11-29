import { z } from "zod";

export const invoiceSchema = z.object({
  invoiceName: z.string().min(1, "Invoice name is required"),
  total: z.number().min(1, "1$ is minimum amount"),
  status: z.enum(["PAID", "PENDING"]).default("PENDING"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.number().min(1, "Minimum due date is 1"),
  fromName: z.string().min(1, "From name is required"),
  fromEmail: z.string().email().min(1, "Invalid email"),
  fromAddress: z.string().min(1, "From address is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email().min(1, "Invalid email"),
  clientAddress: z.string().min(1, "Client address is required"),
  currency: z.string().min(1, "Currency is required"),
  invoiceNumber: z.number().min(1, "Minimum invoice number is 1"),
  note: z.string().optional(),
  invoiceItemDescription: z
    .string()
    .min(1, "Invoice item description is required"),
  invoiceItemQuantity: z.number().min(1, "Minimum quantity is 1"),
  invoiceItemRate: z.number().min(1, "Minimum rate is 1"),
});
