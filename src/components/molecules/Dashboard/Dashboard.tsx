"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Popper,
  ClickAwayListener,
  IconButton,
} from "@mui/material";
import {
  DateRange as DateRangeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { RangeKeyDict } from "react-date-range";
import { Surveys } from "@/locales/surveys";
import { useAnalytics } from "@/shared/Hook-form/useAnalytics";
import { DateRangePayload } from "@/types/Analytics";
import AnalyticsCard from "@/shared/AnalyticsCard/AnalyticsCard";
import moment from "moment";
import { Shared } from "@/locales/shared";
import ClientOnly from "@/components/ClientOnly";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={350}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ marginLeft: 2 }}>
        Loading chart...
      </Typography>
    </Box>
  ),
});

const Dashboard = () => {
  const {
    data: analyticsData,
    loading,
    error,
    fetchAnalytics,
  } = useAnalytics();

  const [dateRange, setDateRange] = useState(() => ({
    startDate: moment().subtract(7, "days").toDate(), // 7 days ago
    endDate: moment().toDate(),
    key: "selection",
  }));

  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Update temp date range when main date range changes
  useEffect(() => {
    setTempDateRange(dateRange);
  }, [dateRange]);

  // Fetch initial data
  useEffect(() => {
    const payload: DateRangePayload = {
      startDate: moment(dateRange.startDate).format("YYYY-MM-DD"),
      endDate: moment(dateRange.endDate).format("YYYY-MM-DD"),
    };
    fetchAnalytics(payload);
  }, [dateRange.startDate, dateRange.endDate, fetchAnalytics]);

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { startDate, endDate, key } = ranges.selection;
    const newTempDateRange = {
      startDate: startDate ?? new Date(),
      endDate: endDate ?? new Date(),
      key: key ?? "selection",
    };
    setTempDateRange(newTempDateRange);
  };

  const handleOpenPopper = () => {
    setTempDateRange(dateRange); // Reset temp range to current range
    setIsPopperOpen(true);
  };

  const handleClosePopper = () => {
    setIsPopperOpen(false);
  };

  const handleSaveDateRange = () => {
    setDateRange(tempDateRange);
    setIsPopperOpen(false);

    // Fetch data with new date range
    const payload: DateRangePayload = {
      startDate: moment(tempDateRange.startDate).format("YYYY-MM-DD"),
      endDate: moment(tempDateRange.endDate).format("YYYY-MM-DD"),
    };
    fetchAnalytics(payload);
  };

  const handleRetry = () => {
    const payload: DateRangePayload = {
      startDate: moment(dateRange.startDate).format("YYYY-MM-DD"),
      endDate: moment(dateRange.endDate).format("YYYY-MM-DD"),
    };
    fetchAnalytics(payload);
  };

  // Chart configuration
  const chartData = analyticsData
    ? {
        series: [
          {
            name: "Surveys",
            data: analyticsData.chartData.surveys,
          },
          {
            name: "Responses",
            data: analyticsData.chartData.responses,
          },
        ],
        options: {
          chart: {
            type: "line" as const,
            height: 350,
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          xaxis: {
            categories: analyticsData.chartData.dates,
            title: {
              text: "Date",
            },
          },
          yaxis: {
            title: {
              text: "Count",
            },
          },
          stroke: {
            curve: "smooth" as const,
            width: 2,
          },
          colors: ["#1976d2", "#f57c00"],
          legend: {
            show: true,
            position: "top" as const,
          },
          tooltip: {
            shared: true,
            intersect: false,
          },
          grid: {
            show: false,
          },
        },
      }
    : null;

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography data-testid="dashboard-title" variant="h5" gutterBottom>
        {Surveys.dashboard.title}
      </Typography>

      {/* Error handling */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              {Surveys.dashboard.retry}
            </Button>
          }
          sx={{ marginBottom: "20px" }}
        >
          {Surveys.dashboard.error}: {error}
        </Alert>
      )}

      {/* Date Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <ClientOnly
          fallback={
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              disabled
              sx={{ minWidth: "200px" }}
            >
              Loading dates...
            </Button>
          }
        >
          <Button
            data-testid="date-range-button"
            ref={anchorRef}
            variant="outlined"
            startIcon={<DateRangeIcon />}
            onClick={handleOpenPopper}
            sx={{ minWidth: "200px" }}
          >
            {moment(dateRange.startDate).format("MMM DD, YYYY")} -{" "}
            {moment(dateRange.endDate).format("MMM DD, YYYY")}
          </Button>
        </ClientOnly>
      </Box>

      {/* Date Range Popper */}
      <Popper
        open={isPopperOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClosePopper}>
          <Paper elevation={8} sx={{ p: 2, mt: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Select Date Range</Typography>
              <IconButton size="small" onClick={handleClosePopper}>
                <CloseIcon />
              </IconButton>
            </Box>

            <ClientOnly
              fallback={
                <Box
                  sx={{
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Loading date picker...</Typography>
                </Box>
              }
            >
              <DateRange
                ranges={[tempDateRange]}
                onChange={handleDateChange}
                rangeColors={["#1976d2"]}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
              />
            </ClientOnly>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                data-testid="date-range-cancel-button"
                variant="outlined"
                onClick={handleClosePopper}
              >
                Cancel
              </Button>
              <Button
                data-testid="date-range-save-button"
                variant="contained"
                onClick={handleSaveDateRange}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
        <AnalyticsCard
          title={Surveys.dashboard.totalSurveys}
          value={analyticsData?.totalSurveys || 0}
          loading={loading}
          dataTestId="total-surveys-card"
        />
        <AnalyticsCard
          title={Surveys.dashboard.totalResponses}
          value={analyticsData?.totalResponses || 0}
          loading={loading}
          dataTestId="total-responses-card"
        />
        <AnalyticsCard
          title={Surveys.dashboard.totalUsers}
          value={analyticsData?.totalUsers || 0}
          loading={loading}
          dataTestId="total-users-card"
        />
      </Grid>

      {/* Chart Section */}
      <Paper elevation={1} sx={{ padding: "20px" }}>
        <Typography data-testid="survey-chart-title" variant="h6" gutterBottom>
          {Surveys.dashboard.surveyChartTitle}
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={350}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ marginLeft: 2 }}>
              {Surveys.dashboard.loading}
            </Typography>
          </Box>
        ) : chartData ? (
          <ClientOnly
            fallback={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={350}
              >
                <CircularProgress />
                <Typography variant="body1" sx={{ marginLeft: 2 }}>
                  Loading chart...
                </Typography>
              </Box>
            }
          >
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="line"
              height={350}
            />
          </ClientOnly>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={350}
          >
            <Typography variant="body1" color="textSecondary">
              {Shared.noDataAvailable}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
