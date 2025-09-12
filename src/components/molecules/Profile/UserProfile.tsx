"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, shallowEqual } from "react-redux";

import { dispatch } from "@/app/redux/store";
import {
  fetchProfile,
  updateProfile,
  resetProfileState,
} from "@/app/redux/slices/profileSlice";
import {
  selectProfileLoading,
  selectProfileError,
  selectProfileData,
  selectUpdateSuccess,
} from "@/app/redux/selector/profile";
import { ProfileValidationSchema } from "./helper";
import { ProfileFormData } from "@/types/Profile";
import { Profile } from "@/locales/profile";
import { Shared } from "@/locales/shared";
import { Register } from "@/locales/register";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Redux selectors
  const isLoading = useSelector(selectProfileLoading, shallowEqual);
  const profileData = useSelector(selectProfileData, shallowEqual);
  const error = useSelector(selectProfileError, shallowEqual);
  const updateSuccess = useSelector(selectUpdateSuccess, shallowEqual);

  const initialProfileRef = useRef<ProfileFormData>(profileData);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(ProfileValidationSchema),
  });

  // Fetch user profile data
  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  // Reset form when profile data is loaded
  useEffect(() => {
    if (profileData) {
      initialProfileRef.current = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      };
      reset(initialProfileRef.current);
    }
  }, [profileData, reset]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      // Reset the success state after a delay
      setTimeout(() => {
        dispatch(resetProfileState());
      }, 3000);
    }
  }, [updateSuccess]);

  const onSubmit = async (data: ProfileFormData) => {
    await dispatch(updateProfile(data));
  };

  const handleCancel = () => {
    setIsEditing(false);
    dispatch(resetProfileState());
    if (initialProfileRef.current) {
      reset(initialProfileRef.current);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography data-testid="user-profile-title" variant="h4" gutterBottom>
        {Profile.title}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      {updateSuccess && (
        <Alert
          data-testid="profile-success-alert"
          severity="success"
          sx={{ mb: 3 }}
        >
          {Profile.updateMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: "center", p: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {profileData?.firstName?.charAt(0) || <PersonIcon />}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {profileData?.firstName} {profileData?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {profileData?.role}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Profile.memberSince}{" "}
              {profileData?.createdAt
                ? new Date(profileData.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Card>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">{Profile.profileInfo}</Typography>
                {!isEditing ? (
                  <Button
                    data-testid="edit-profile-button"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    {Shared.edit}
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      data-testid="cancel-profile-button"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      {Shared.cancel}
                    </Button>
                    <Button
                      data-testid="save-profile-button"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                    >
                      {isLoading ? Shared.saving : Shared.save}
                    </Button>
                  </Box>
                )}
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          data-testid="firstName"
                          {...field}
                          fullWidth
                          placeholder={isEditing ? Register.firstName : ""}
                          disabled={!isEditing}
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          data-testid="lastName"
                          {...field}
                          fullWidth
                          placeholder={isEditing ? Register.lastName : ""}
                          disabled={!isEditing}
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          data-testid="email"
                          {...field}
                          fullWidth
                          placeholder={isEditing ? Register.emailLabel : ""}
                          type="email"
                          disabled={!isEditing}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={Register.role}
                      value={profileData?.role || ""}
                      disabled
                      helperText={Profile.roleNotChanged}
                    />
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {Profile.accountInfo}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {Profile.accountStatus}
            </Typography>
            <Typography variant="body1">{Profile.active}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              {Profile.lastLogin}
            </Typography>
            <Typography variant="body1">
              {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile;
