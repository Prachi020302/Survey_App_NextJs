"use client";

import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import UserResponseList from "@/components/molecules/Response/UserResponseList";



const MyResponsesPage = () => {
  

  return (
    <ReduxRoleGuard allowedRoles={["User"]}>
      <MainLayout>
        <UserResponseList />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default MyResponsesPage;
