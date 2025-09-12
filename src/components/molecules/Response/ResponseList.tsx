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
  Button,
  CircularProgress,
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/molecules/Navigation/MainLayout";
import ReduxRoleGuard from "@/components/Auth/ReduxRoleGuard";
import { useSelector, shallowEqual } from "react-redux";
import {
  selectAllResponses,
  selectResponseLoading,
} from "@/app/redux/selector/response";
import { dispatch } from "@/app/redux/store";
import { getAllResponses } from "@/app/redux/slices/responseSlice";
import { Response } from "@/locales/response";

interface ResponseData {
  id: string;
  surveyId: {
    id: string;
    title: string;
    description?: string;
  };
  userId: string;
  submittedAt: string;
  answers: {
    questionId: string;
    selectedOptions: string[];
  }[];
}

const ResponseList = () => {
  const router = useRouter();
  const allResponses = useSelector(selectAllResponses, shallowEqual);
  const loading = useSelector(selectResponseLoading, shallowEqual);

  useEffect(() => {
    dispatch(getAllResponses());
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewResponse = (responseId: string) => {
    router.push(`/response-detail?responseId=${responseId}`);
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

  return (
    <Box>
      <Typography data-testid="response-list-title" variant="h5" gutterBottom>
        {Response.list.title}
      </Typography>
      <Typography
        data-testid="response-list-subtitle"
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {Response.list.subTitle}
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Response.list.surveyTitle}</TableCell>
                  <TableCell>{Response.list.userId}</TableCell>
                  <TableCell>{Response.list.submittedDate}</TableCell>
                  <TableCell>{Response.list.status}</TableCell>
                  <TableCell>{Response.list.questionsAnswered}</TableCell>
                  <TableCell>{Response.list.actions}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(allResponses.data as ResponseData[]).map(
                  (response, index) => (
                    <TableRow key={response.id + index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {response.surveyId?.title ||
                            Response.list.surveyTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {response.userId || "Anonymous"}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(response.submittedAt)}</TableCell>
                      <TableCell>
                        <Chip label="completed" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {response.answers?.length || 0}{" "}
                          {Response.list.questionsAnswered}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          data-testid={`view-response-button-${index}`}
                          size="small"
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewResponse(response.id)}
                        >
                          {Response.list.viewButton}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {allResponses.data.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {Response.list.noResponse}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Response.list.noResponseSubtitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResponseList;
