import AppSidebar from "@/components/shared/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {/* Sidebar */}
          <AppSidebar />
          {/* Main Content */}
          <main className="flex-grow flex flex-col">
            <SidebarTrigger />
            <div className="p-6 flex-1">{children}</div>
          </main>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
