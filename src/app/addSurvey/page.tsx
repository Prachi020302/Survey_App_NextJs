"use client";

import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import AddSurvey from "@/components/molecules/Surveys/AddSurvey";

const AddSurveyPage = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin"]}>
      <MainLayout>
        <AddSurvey />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default AddSurveyPage;
