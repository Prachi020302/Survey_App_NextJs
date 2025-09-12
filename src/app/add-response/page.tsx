"use client";

import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import AddResponse from "@/components/molecules/Response/AddResponse";

const AddResponsePage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["User", "Admin"]}>
      <MainLayout>
        <AddResponse />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default AddResponsePage;
