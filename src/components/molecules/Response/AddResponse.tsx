import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormGroup,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Snackbar,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { useSelector, shallowEqual } from "react-redux";
import { LoginState } from "@/app/redux/selector/auth";
import { dispatch } from "@/app/redux/store";
import { getSurveyById } from "@/app/redux/slices/surveySlice";
import {
  submitResponse,
  resetSubmissionState,
} from "@/app/redux/slices/responseSlice";
import {
  selectSurveysLoading,
  selectCurrentSurvey,
} from "@/app/redux/selector/survey";
import {
  selectResponseLoading,
  selectSubmissionSuccess,
  selectResponseError,
} from "@/app/redux/selector/response";
import { Shared } from "@/locales/shared";
import { Response } from "@/locales/response";
import { Surveys } from "@/locales/surveys";

interface IField {
  id: string;
  label: string;
  type: "text" | "number" | "checkbox" | "select" | "radio";
  options?: string[];
}

interface FormData {
  [key: string]: string | string[];
}

const AddResponse = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("surveyId");
  const user = useSelector(LoginState, shallowEqual);

  // Redux selectors
  const currentSurvey = useSelector(selectCurrentSurvey, shallowEqual);
  const surveyLoading = useSelector(selectSurveysLoading, shallowEqual);
  const isSubmitting = useSelector(selectResponseLoading, shallowEqual);
  const submissionSuccess = useSelector(selectSubmissionSuccess, shallowEqual);
  const responseError = useSelector(selectResponseError, shallowEqual);

  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    if (!surveyId) {
      router.push("/surveys");
      return;
    }

    dispatch(getSurveyById(surveyId));
  }, [surveyId, router]);

  useEffect(() => {
    if (currentSurvey) {
      // Initialize form data
      const initialData: FormData = {};
      currentSurvey.questions.forEach((question: IField) => {
        if (question.type === "checkbox") {
          initialData[question.id] = [];
        } else {
          initialData[question.id] = "";
        }
      });
      setFormData(initialData);
    }
  }, [currentSurvey]);

  useEffect(() => {
    if (submissionSuccess) {
      setSnackbar({
        open: true,
        message: "Response submitted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        dispatch(resetSubmissionState());
        router.push("/my-responses");
      }, 2000);
    }
  }, [submissionSuccess, router]);

  useEffect(() => {
    if (responseError) {
      setSnackbar({
        open: true,
        message: responseError.message || "Failed to submit response",
        severity: "error",
      });
    }
  }, [responseError]);

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => ({
        ...prev,
        [questionId]: "",
      }));
    }
  };

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean
  ) => {
    const currentValues = (formData[questionId] as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, option];
    } else {
      newValues = currentValues.filter((v) => v !== option);
    }

    handleInputChange(questionId, newValues);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    currentSurvey?.questions.forEach((question) => {
      const value = formData[question.id];

      if (question.type === "checkbox") {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[question.id] = `${Response.error.checkBoxError}`;
        }
      } else {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[question.id] = `${Response.error.requiredField}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: `${Response.error.allRequired}`,
        severity: "error",
      });
      return;
    }

    if (!currentSurvey || !surveyId) return;

    // Format answers according to the response model
    const answers = currentSurvey.questions.map((question) => ({
      questionId: question.id,
      selectedOptions: Array.isArray(formData[question.id])
        ? (formData[question.id] as string[])
        : [formData[question.id] as string],
    }));

    const responseData = {
      surveyId: surveyId,
      userId: user?.id,
      answers: answers,
    };

    dispatch(submitResponse(responseData));
  };

  const renderField = (question: IField) => {
    const hasError = !!errors[question.id];
    const isDisabled = isAdmin; // Disable fields for admin

    switch (question.type) {
      case "text":
        return (
          <TextField
            key={question.id}
            fullWidth
            label={question.label}
            value={(formData[question.id] as string) || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            error={hasError}
            helperText={errors[question.id]}
            variant="outlined"
            margin="normal"
            required
            disabled={isDisabled}
            data-testid={question.type}
          />
        );

      case "number":
        return (
          <TextField
            key={question.id}
            fullWidth
            type="number"
            label={question.label}
            value={(formData[question.id] as string) || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            error={hasError}
            helperText={errors[question.id]}
            variant="outlined"
            margin="normal"
            required
            disabled={isDisabled}
            data-testid={question.type}
          />
        );

      case "radio":
        return (
          <FormControl
            data-testid={question.type}
            key={question.id}
            fullWidth
            margin="normal"
            error={hasError}
            disabled={isDisabled}
          >
            <FormLabel required>{question.label}</FormLabel>
            <RadioGroup
              value={(formData[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            >
              {question.options?.map((option, index) => (
                <FormControlLabel
                  data-testid={`radio-option-${index}`}
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={isDisabled}
                />
              ))}
            </RadioGroup>
            {hasError && (
              <Typography
                data-testid="radio-error"
                variant="caption"
                color="error"
                sx={{ mt: 1 }}
              >
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl
            data-testid={question.type}
            key={question.id}
            fullWidth
            margin="normal"
            error={hasError}
            disabled={isDisabled}
          >
            <FormLabel required>{question.label}</FormLabel>
            <FormGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      data-testid={`checkbox-option-${index}`}
                      checked={
                        (formData[question.id] as string[])?.includes(option) ||
                        false
                      }
                      onChange={(e) =>
                        handleCheckboxChange(
                          question.id,
                          option,
                          e.target.checked
                        )
                      }
                      disabled={isDisabled}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {hasError && (
              <Typography
                data-testid="checkbox-error"
                variant="caption"
                color="error"
                sx={{ mt: 1 }}
              >
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      case "select":
        return (
          <FormControl
            data-testid={question.type}
            key={question.id}
            fullWidth
            margin="normal"
            error={hasError}
            disabled={isDisabled}
          >
            <InputLabel required>{question.label}</InputLabel>
            <Select
              value={(formData[question.id] as string) || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              label={question.label}
            >
              {question.options?.map((option, index) => (
                <MenuItem
                  key={option}
                  value={option}
                  data-testid={`select-option-${index}`}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
            {hasError && (
              <Typography
                data-testid="select-error"
                variant="caption"
                color="error"
                sx={{ mt: 1 }}
              >
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (surveyLoading) {
    return (
      <ReduxRoleGuard allowedRoles={["User", "Admin"]}>
        <MainLayout>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        </MainLayout>
      </ReduxRoleGuard>
    );
  }

  if (!currentSurvey) {
    return (
      <ReduxRoleGuard allowedRoles={["User", "Admin"]}>
        <MainLayout>
          <Box>
            <Alert severity="error">{Shared.surveyNotFound}</Alert>
          </Box>
        </MainLayout>
      </ReduxRoleGuard>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {currentSurvey.title}
      </Typography>
      {currentSurvey.description && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {currentSurvey.description}
        </Typography>
      )}

      {isAdmin && (
        <Alert data-testid="response-alert" severity="info" sx={{ mb: 3 }}>
          {Response.responseAlert}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {currentSurvey.questions.map(renderField)}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              data-testid="cancel-button"
              type="button"
              variant="outlined"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              {Surveys.surveyList.cancelButton}
            </Button>
            {!isAdmin && (
              <Button
                data-testid="submit-response-button"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  Response.submitButton
                )}
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          data-testid="survey-alert"
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddResponse;
