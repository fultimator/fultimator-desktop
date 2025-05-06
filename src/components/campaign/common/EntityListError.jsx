import React from "react";
import { Alert, Button } from "@mui/material";

const EntityListError = ({retry, loadError}) => {

  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {loadError}
      <Button
        color="inherit"
        size="small"
        onClick={() => retry()}
        sx={{ ml: 2 }}
      >
        Retry
      </Button>
    </Alert>
  );
};

export default EntityListError;
