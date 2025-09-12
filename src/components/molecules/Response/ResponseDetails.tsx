"use client";

import React, { useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { useSelector, shallowEqual } from "react-redux";
import { dispatch } from "@/app/redux/store";
import { getResponseById } from "@/app/redux/slices/responseSlice";
import {
  selectCurrentResponse,
  selectResponseLoading,
  selectResponseError,
} from "@/app/redux/selector/response";
import { ResponseDetailData } from "@/types/Response";
import { Response } from "@/locales/response";

const ResponseDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const responseId = searchParams.get("responseId");

  const currentResponse = useSelector(
    selectCurrentResponse,
    shallowEqual
  ) as ResponseDetailData | null;
  const loading = useSelector(selectResponseLoading, shallowEqual);
  const error = useSelector(selectResponseError, shallowEqual);

  useEffect(() => {
    if (!responseId) {
      router.push("/responses");
      return;
    }

    dispatch(getResponseById(responseId));
  }, [responseId, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ReduxRoleGuard allowedRoles={["Admin"]}>
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

  if (error || !currentResponse) {
    return (
      <ReduxRoleGuard allowedRoles={["Admin"]}>
        <MainLayout>
          <Box>
            <Alert severity="error">
              {error?.message || "Response not found or no longer available."}
            </Alert>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{ mt: 2 }}
            >
              Back
            </Button>
          </Box>
        </MainLayout>
      </ReduxRoleGuard>
    );
  }

  return (
    <Box>
      <Button
        data-testid="back-button"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        {Response.details.backToResponse}
      </Button>

      <Typography
        data-testid="response-details-title"
        variant="h6"
        gutterBottom
      >
        {Response.details.title}
      </Typography>

      {/* Response Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            data-testid="response-details-summary"
            variant="h6"
            gutterBottom
          >
            {Response.details.summary}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {Response.list.surveyTitle}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {currentResponse.surveyId?.title || "Unknown Survey"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {Response.list.userId}
              </Typography>
              <Typography variant="body1">
                {currentResponse.userId || "Anonymous"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {Response.list.submittedDate}
              </Typography>
              <Typography variant="body1">
                {formatDate(currentResponse.submittedAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {Response.list.status}
              </Typography>
              <Chip label="Completed" color="success" size="small" />
            </Box>
          </Box>
          {currentResponse.surveyId?.description && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {Response.details.surveyDescription}
              </Typography>
              <Typography variant="body1">
                {currentResponse.surveyId.description}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Response Answers */}
      <Card>
        <CardContent>
          <Typography
            data-testid="response-details-answers"
            variant="h6"
            gutterBottom
          >
            {Response.details.answers} ({currentResponse.answers?.length || 0}{" "}
            {Response.list.questions})
          </Typography>
          <List>
            {currentResponse.answers?.map((answer, index) => (
              <React.Fragment key={answer.questionId}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={500}>
                        {Response.details.Question} {index + 1}:{" "}
                        {answer.questionLabel ||
                          `Question ID: ${answer.questionId}`}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {Response.details.Answer}:
                        </Typography>
                        {answer.selectedOptions?.map((option, optionIndex) => (
                          <Chip
                            key={optionIndex}
                            label={option}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
                {index < currentResponse.answers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          {(!currentResponse.answers ||
            currentResponse.answers.length === 0) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {Response.details.noAnswers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Response.details.emptyResponse}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResponseDetails;
