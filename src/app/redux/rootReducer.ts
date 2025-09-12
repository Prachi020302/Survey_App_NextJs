"use client";

import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { surveyReducer } from "./slices/surveySlice";
import { responseReducer } from "./slices/responseSlice";
import { profileReducer } from "./slices/profileSlice";
import { analyticsReducer } from "./slices/analyticsSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  survey: surveyReducer,
  response: responseReducer,
  profile: profileReducer,
  analytics: analyticsReducer,
});

export { rootReducer };
