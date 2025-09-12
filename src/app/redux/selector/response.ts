import { RootState } from "../store";

export const selectResponseLoading = (state: RootState) => state.response.loading;
export const selectResponseError = (state: RootState) => state.response.error;
export const selectSubmissionSuccess = (state: RootState) => state.response.submissionSuccess;
export const selectUserResponses = (state: RootState) => state.response.userResponses;
export const selectAllResponses = (state: RootState) => state.response.allResponses;
export const selectCurrentResponse = (state: RootState) => state.response.currentResponse;
