import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as LinkIcon, Add as AddIcon } from "@mui/icons-material";

const BrowserTabHeader = ({ title, actions }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h4">{title}</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {actions}
      </Box>
    </Box>
  );
};

export default BrowserTabHeader;
