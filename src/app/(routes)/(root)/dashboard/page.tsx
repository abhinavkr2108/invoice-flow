import UserAvatar from "@/components/shared/user-avatar";
import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";
import { requireUser } from "@/hooks/require-user";
import AppSidebar from "@/components/shared/app-sidebar";

export default async function DashboardPage() {
  const session = await requireUser();
  return <div>{/* <AppSidebar /> */} Hello</div>;
}
