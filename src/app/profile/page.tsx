"use client";

import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { Box, CircularProgress } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import UserProfile from "@/components/molecules/Profile/UserProfile";
import {
  selectProfileData,
  selectProfileLoading,
} from "../redux/selector/profile";

const ProfilePage = () => {
  const isLoading = useSelector(selectProfileLoading, shallowEqual);
  const profileData = useSelector(selectProfileData, shallowEqual);

  if (isLoading && !profileData) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <ReduxRoleGuard allowedRoles={["Admin", "User"]}>
      <MainLayout>
        <UserProfile />
      </MainLayout>
    </ReduxRoleGuard>
  );
};

export default ProfilePage;
