"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Switch,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { shallowEqual, useSelector } from "react-redux";
import { selectSurveyList } from "@/app/redux/selector/survey";
import { dispatch } from "@/app/redux/store";
import {
  getSurveys,
  updateSurveyStatus,
  deleteSurvey,
} from "@/app/redux/slices/surveySlice";
import { LoginState } from "@/app/redux/selector/auth";
import { ENUM_USER } from "@/Backend/types/User";
import DeleteButton from "@/components/Atoms/DeleteButton";
import { Surveys } from "@/locales/surveys";

const SurveysCard = () => {
  const router = useRouter();

  const role = useSelector(LoginState, shallowEqual)?.role;
  const data = useSelector(selectSurveyList, shallowEqual) || [];

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      await dispatch(getSurveys());
    };
    fetchSurveys();
  }, []); // Remove role dependency to prevent infinite loop

  const toggleSurveyStatus = async (id: string, isActive: boolean) => {
    const response = await dispatch(updateSurveyStatus({ id, isActive }));
    if (updateSurveyStatus.fulfilled.match(response)) {
      await dispatch(getSurveys());
    }
  };

  const handleDeleteSurvey = async () => {
    if (selectedSurveyId) {
      const response = await dispatch(deleteSurvey(selectedSurveyId));
      if (deleteSurvey.fulfilled.match(response)) {
        await dispatch(getSurveys());
      }
      setDialogOpen(false);
      setSelectedSurveyId(null);
    }
  };

  const handleOpenDialog = (id: string) => {
    setSelectedSurveyId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSurveyId(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          marginTop: 2,
        }}
      >
        {data.map((survey, index) => (
          <Card key={survey.id + index} sx={{ p: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography
                    data-testid={`survey-title-${index}`}
                    variant="h6"
                  >
                    {survey.title}
                  </Typography>
                  <Typography
                    data-testid={`survey-description-${index}`}
                    variant="body2"
                    sx={{ mb: 2 }}
                  >
                    {survey.description}
                  </Typography>
                </Box>
                <Box>
                  {role === ENUM_USER.ADMIN && (
                    <DeleteButton
                      dataTestId={`delete-survey-button-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(survey.id);
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  data-testid={`survey-status-${index}`}
                  variant="body2"
                  sx={{ mr: 1 }}
                >
                  {survey.isActive ? "Active" : "Inactive"}
                </Typography>
                <Switch
                  data-testid={`survey-toggle-${index}`}
                  disabled={role !== ENUM_USER.ADMIN}
                  checked={survey.isActive}
                  onChange={(e) =>
                    toggleSurveyStatus(survey.id, e.target.checked)
                  }
                />
              </Box>

              <Button
                data-testid={`take-survey-button-${index}`}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  router.push(`/add-response?surveyId=${survey.id}`)
                }
                disabled={!survey.isActive}
              >
                {Surveys.surveyList.surveyButton}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{Surveys.surveyList.deleteTitle}</DialogTitle>
        <DialogContent>
          <Typography>{Surveys.surveyList.deleteSubtitle}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            {Surveys.surveyList.cancelButton}
          </Button>
          <Button
            data-testid="confirm-delete-button"
            onClick={handleDeleteSurvey}
            color="error"
            variant="contained"
          >
            {Surveys.surveyList.deleteButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SurveysCard;
