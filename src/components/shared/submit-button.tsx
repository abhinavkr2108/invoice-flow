"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface SubmitButtonProps {
  text: string;
}
export default function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled type="submit" className="btn loading">
          <Loader2Icon className="animate-spin size-4 mr-1" /> Please Wait...
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          {text}
        </Button>
      )}
    </>
  );
}
