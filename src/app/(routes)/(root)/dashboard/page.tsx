import React, { Suspense } from "react";
import { requireUser } from "@/hooks/require-user";
import DashBoardBlocks from "./components/dashboard-blocks";
import DashboardGraph from "./components/dashboard-graph";
import RecentInvoices from "./components/recent-invoices";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  await requireUser();
  return (
    <React.Fragment>
      <DashBoardBlocks />
      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        <div className="lg:col-span-2">
          <DashboardGraph />
        </div>
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <RecentInvoices />
        </Suspense>
      </div>
    </React.Fragment>
  );
}
