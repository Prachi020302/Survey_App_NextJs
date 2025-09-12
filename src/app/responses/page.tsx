"use client";

import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ResponseList from "@/components/molecules/Response/ResponseList";

const ResponsesPage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin"]}>
      <MainLayout>
        <ResponseList />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default ResponsesPage;
