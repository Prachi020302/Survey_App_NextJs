"use client";

import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const SurveyState = (state: RootState) => state.survey;

// get surveys
export const selectSurvey = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.surveys
);

export const selectSurveyList = createSelector(
  [selectSurvey],
  (surveys) => surveys.surveyList
);

export const selectSurveyListCount = createSelector(
  [selectSurvey],
  (surveys) => surveys.count
);

export const selectSurveysLoading = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.loading
);
export const selectSurveysError = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.error
);
// get survey by id
export const selectSurveyById = createSelector(
  [SurveyState, (state, surveyId) => surveyId],
  (SurveyState, surveyId) =>
    SurveyState.surveys.surveyList.find((survey) => survey.id === surveyId)
);
export const selectSurveyByIdLoading = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.loading
);
export const selectSurveyByIdError = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.error
);

export const selectCurrentSurvey = createSelector(
  [SurveyState],
  (SurveyState) => SurveyState.currentSurvey
);
