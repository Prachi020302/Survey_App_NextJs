"use client";

import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import ResponseDetails from "@/components/molecules/Response/ResponseDetails";

const ResponseDetailPage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin"]}>
      <MainLayout>
        <ResponseDetails />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default ResponseDetailPage;
