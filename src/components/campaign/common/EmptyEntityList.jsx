import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link as LinkIcon } from "@mui/icons-material";

const EmptyEntityList = ({ type, handleAdd }) => {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
        border: "2px dashed",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
        No {type}s in this campaign yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add {type}s to bring your campaign world to life
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<LinkIcon />}
          onClick={handleAdd}
        >
          Link Existing {type}
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyEntityList;
