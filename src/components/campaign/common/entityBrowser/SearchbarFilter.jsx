import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Collapse,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const SearchbarFilter = ({ searchBarText, filtersComponent, handleClear, searchText, handleSearchTextUpdate }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 0 }}>
      {/* Always visible search row with expand/collapse button */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <TextField
          label={searchBarText || "Search..."}
          placeholder="Name"
          size="small"
          value={searchText}
          onChange={(e) => handleSearchTextUpdate(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchText ? (
              <IconButton
                aria-label="clear"
                onClick={() => handleSearchTextUpdate("")}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            ) : null,
          }}
        />

        <Button
          onClick={toggleExpanded}
          startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
          size="small"
          color={isDarkMode ? "white" : "primary"}
        >
          {expanded ? "Hide Filters" : "More Filters"}
        </Button>
        <Tooltip title="Clear all filters">
          <Button
            onClick={handleClear}
            sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
            size="small"
            color={isDarkMode ? "white" : "primary"}
          >
            <DeleteSweepIcon />
          </Button>
        </Tooltip>
      </Box>

      {/* Expandable filters section */}
      <Collapse in={expanded} timeout="auto">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
            p: 2,
            borderRadius: 1,
            bgcolor: theme.palette.background.paper,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ width: "100%", mb: 1 }}>
            Advanced Filters
          </Typography>
          {filtersComponent}
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchbarFilter;
