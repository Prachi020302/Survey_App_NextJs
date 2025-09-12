import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";

const AnalyticsCard = ({
  title,
  value,
  loading,
  dataTestId,
}: {
  title: string;
  value: number;
  loading: boolean;
  dataTestId: string;
}) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper
      elevation={2}
      sx={{
        padding: "20px",
        textAlign: "center",
        borderRadius: "12px",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Typography data-testid={dataTestId} variant="h3" color="primary">
          {value.toLocaleString()}
        </Typography>
      )}
    </Paper>
  </Grid>
);

export default AnalyticsCard;
