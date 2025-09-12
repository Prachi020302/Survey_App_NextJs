"use client";

import { Box, Grid } from "@mui/material";
import type { ReactNode } from "react";
import MainPageImage from "../../Icons/LoginImage";

interface LayoutsProps {
  children: ReactNode;
}

const Layouts = ({ children }: LayoutsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "1000px",
          border: "1px solid grey",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <Grid item xs={12} md={6}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {children}
          </Box>
        </Grid>
        <Grid item xs={12} xl={6} md={6}>
          <Box
            sx={{
              width: "500px",
              height: "500px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <MainPageImage />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layouts;
