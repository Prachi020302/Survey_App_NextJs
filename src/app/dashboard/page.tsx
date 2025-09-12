"use client";

import Dashboard from "@/components/molecules/Dashboard/Dashboard";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";

const DashboardPage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin"]}>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default DashboardPage;
