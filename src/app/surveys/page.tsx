"use client";

import SurveysCard from "@/components/molecules/Surveys/SurveyCard";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { Typography } from "@mui/material";
import { Surveys as survey } from "@/locales/surveys";

const Surveys = () => {
  return (
    <ReduxRoleGuard allowedRoles={["Admin", "User"]}>
      <MainLayout>
        <Typography data-testid="survey-list-title" variant="h5" gutterBottom>
          {survey.surveyList.title}
        </Typography>
        <SurveysCard />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default Surveys;
