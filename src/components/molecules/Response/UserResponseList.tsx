"use client";

import React, { useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { useSelector, shallowEqual } from "react-redux";
import { LoginState } from "@/app/redux/selector/auth";
import {
  selectUserResponses,
  selectResponseLoading,
} from "@/app/redux/selector/response";
import { dispatch } from "@/app/redux/store";
import { getUserResponses } from "@/app/redux/slices/responseSlice";
import { Response } from "@/locales/response";

interface ResponseData {
  id: string;
  surveyId: {
    id: string;
    title: string;
    description?: string;
  };
  submittedAt: string;
  answers: {
    questionId: string;
    selectedOptions: string[];
  }[];
}

const UserResponseList = () => {
  const user = useSelector(LoginState, shallowEqual);
  const userResponses = useSelector(selectUserResponses, shallowEqual);
  const loading = useSelector(selectResponseLoading, shallowEqual);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserResponses(user.id));
    }
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <ReduxRoleGuard allowedRoles={["User"]}>
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

  return (
    <Box>
      <Typography data-testid="my-response-title" variant="h6" gutterBottom>
        {Response.list.myResponseTitle}
      </Typography>
      <Typography
        data-testid="my-response-subtitle"
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {Response.list.myResponseSubTitle}
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Response.list.surveyTitle}</TableCell>
                  <TableCell>{Response.list.description}</TableCell>
                  <TableCell>{Response.list.submittedDate}</TableCell>
                  <TableCell>{Response.list.status}</TableCell>
                  <TableCell>{Response.list.questionsAnswered}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(userResponses.data as ResponseData[]).map((response) => (
                  <TableRow key={response.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {response.surveyId?.title || "Survey Title"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {response.surveyId?.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(response.submittedAt)}</TableCell>
                    <TableCell>
                      <Chip label="completed" color="success" size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {response.answers?.length || 0}{" "}
                        {Response.list.questions}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {userResponses.data.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography
                data-testid="no-response-title"
                variant="h6"
                color="text.secondary"
              >
                {Response.list.noResponse}
              </Typography>
              <Typography
                data-testid="no-response-subtitle"
                variant="body2"
                color="text.secondary"
              >
                {Response.list.startSurveySubTitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserResponseList;
