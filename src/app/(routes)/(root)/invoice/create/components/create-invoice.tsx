"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice } from "@/utils/actions";
import { Calendar1Icon } from "lucide-react";
import React, { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/utils/zodSchema";
import SubmitButton from "@/components/shared/submit-button";

export default function CreateInvoice() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");

  const calculateTotal = (Number(rate) || 0) * (Number(quantity) || 0);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: invoiceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Card className="max-w-4xl mx-auto p-5">
      <CardContent>
        <form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name="date" value={selectedDate.toISOString()} />
          <input
            type="hidden"
            name={fields.total.name}
            value={calculateTotal}
          />
          <div className="flex flex-col gap-1 w-fit mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={"secondary"}>Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                defaultValue={fields.invoiceName.value}
                key={fields.invoiceName.key}
                placeholder="Invoice Name"
              />
            </div>
            <p className="text-red-500 text-sm">{fields.invoiceName.errors}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-r-none rounded-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.value}
                  className="rounded-l-none"
                  placeholder="Invoice No."
                />
              </div>
              <p className="text-red-500 text-sm">
                {fields.invoiceNumber.errors}
              </p>
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                defaultValue="USD"
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                  <SelectItem value="INR">Indian Rupee -- INR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  defaultValue={fields.fromName.initialValue}
                  type="text"
                  placeholder="Your Name"
                />
                <p className="text-red-500 text-sm">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={fields.fromEmail.initialValue}
                  type="email"
                  placeholder="Your Email"
                />
                <p className="text-red-500 text-sm">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={fields.fromAddress.initialValue}
                  type="text"
                  placeholder="Your Address"
                />
                <p className="text-red-500 text-sm">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={fields.clientName.initialValue}
                  type="text"
                  placeholder="Client Name"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  type="email"
                  placeholder="Client Email"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
                  type="text"
                  placeholder="Client Address"
                />
                <p className="text-red-500 text-sm">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <div>
                <Label>Invoice Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full text-left justify-start"
                  >
                    <Calendar1Icon />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "full",
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date as Date)}
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>
            <div>
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Due on Reciept </SelectItem>
                  <SelectItem value="15">Net 15 days</SelectItem>
                  <SelectItem value="30">Net 30 days</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
            </div>
          </div>
          <div>
            <div className="grid md:grid-cols-12 gap-4 mt-4">
              <p className="md:col-span-6">Description</p>
              <p className="md:col-span-2">Quantity</p>
              <p className="md:col-span-2">Rate</p>
              <p className="md:col-span-2">Amount</p>
            </div>
            <div className="grid md:grid-cols-12 gap-4 mt-4">
              <div className="md:col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  placeholder="Description"
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className="md:col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className="md:col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  type="number"
                  placeholder="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className="md:col-span-2">
                <Input
                  value={formatCurrency(calculateTotal, currency)}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateTotal, currency)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency(calculateTotal, currency)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label>Notes</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder="Add your note/s here..."
              className="mt-2"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <div>
              <SubmitButton text="Send Invoice to Client" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
