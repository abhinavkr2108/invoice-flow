import React from "react";
import { requireUser } from "@/hooks/require-user";
import DashBoardBlocks from "./components/dashboard-blocks";
import DashboardGraph from "./components/dashboard-graph";

export default async function DashboardPage() {
  const session = await requireUser();
  return (
    <React.Fragment>
      <DashBoardBlocks />
      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        <div className="lg:col-span-2">
          <DashboardGraph />
        </div>
        <div className="lg:col-span-1 bg-gray-300">Hello 2</div>
      </div>
    </React.Fragment>
  );
}
