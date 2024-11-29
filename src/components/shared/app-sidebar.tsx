import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { requireUser } from "@/hooks/require-user";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Invoices",
    url: "/invoice",
    icon: Inbox,
  },
];

export default async function AppSidebar() {
  const session = await requireUser();
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl md:text-2xl font-bold">
              Invoice-Flow
            </SidebarGroupLabel>
            <SidebarGroupContent className="pt-2 flex flex-col justify-between h-full">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center">
            <UserAvatar />
            <div className="flex flex-col ml-2">
              <span className="text-sm font-semibold">
                {session?.user?.name}
              </span>
              <span className="text-xs">{session?.user?.email}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
