import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const EntityListLoading = ({ type }) => {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Loading {type}s...
      </Typography>
    </Box>
  );
};

export default EntityListLoading;
