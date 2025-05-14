import React from "react";
import { Alert, Snackbar } from "@mui/material";

const FeedbackSnackbar = ({ snackbar, handleSnackbarClose }) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
