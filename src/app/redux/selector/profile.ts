import { RootState } from "../store";

export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;
export const selectProfileData = (state: RootState) => state.profile.profileData;
export const selectUpdateSuccess = (state: RootState) => state.profile.updateSuccess;
