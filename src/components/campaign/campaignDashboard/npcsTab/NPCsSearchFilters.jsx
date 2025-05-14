import React from "react";
import {
  Box,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Sort as SortIcon,
  People as PeopleIcon,
  EmojiEvents as VillainIcon,
  SentimentSatisfiedAlt as FriendlyIcon,
  SentimentNeutral as NeutralIcon,
  SentimentVeryDissatisfied as HostileIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";
import { getSpeciesIcon, getRankIcon } from "../../../../libs/npcIcons";
import { useNpcFiltersStore } from "./stores/npcFiltersStore";
import { t } from "../../../../translation/translate";

const attitudeOptions = [
  {
    value: "all",
    label: t("npc_attitude_all"),
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    value: "friendly",
    label: t("npc_attitude_friendly"),
    icon: <FriendlyIcon fontSize="small" />,
  },
  {
    value: "neutral",
    label: t("npc_attitude_neutral"),
    icon: <NeutralIcon fontSize="small" />,
  },
  {
    value: "hostile",
    label: t("npc_attitude_hostile"),
    icon: <HostileIcon fontSize="small" />,
  },
];

const NPCsSearchFilters = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Extract state from the store with individual selectors to prevent unnecessary re-renders
  const npcSortOrder = useNpcFiltersStore((state) => state.npcSortOrder);
  const npcSortDirection = useNpcFiltersStore(
    (state) => state.npcSortDirection
  );
  const npcAttitudeFilter = useNpcFiltersStore(
    (state) => state.npcAttitudeFilter
  );
  const showVillainsOnly = useNpcFiltersStore(
    (state) => state.showVillainsOnly
  );
  const npcRank = useNpcFiltersStore((state) => state.npcRank);
  const npcSpecies = useNpcFiltersStore((state) => state.npcSpecies);

  // Extract actions from the store
  const setNpcSortOrder = useNpcFiltersStore((state) => state.setNpcSortOrder);
  const setNpcSortDirection = useNpcFiltersStore(
    (state) => state.setNpcSortDirection
  );
  const setNpcAttitudeFilter = useNpcFiltersStore(
    (state) => state.setNpcAttitudeFilter
  );
  const setShowVillainsOnly = useNpcFiltersStore(
    (state) => state.setShowVillainsOnly
  );
  const setNpcRank = useNpcFiltersStore((state) => state.setNpcRank);
  const setNpcSpecies = useNpcFiltersStore((state) => state.setNpcSpecies);

  const handleSortChange = (order, direction) => {
    setNpcSortOrder(order);
    if (direction) setNpcSortDirection(direction);
  };

  const handleSortDirectionChange = () => {
    const newDirection = npcSortDirection === "asc" ? "desc" : "asc";
    setNpcSortDirection(newDirection);
  };

  const handleAttitudeChange = (event) => {
    setNpcAttitudeFilter(event.target.value);
  };

  const handleVillainToggle = (event) => {
    setShowVillainsOnly(event.target.checked);
  };

  const handleRankChange = (event) => {
    if (typeof event === "string" || event === null) {
      setNpcRank(event);
    } else {
      setNpcRank(event.target.value);
    }
  };

  const handleSpeciesChange = (event) => {
    if (typeof event === "string" || event === null) {
      setNpcSpecies(event);
    } else {
      setNpcSpecies(event.target.value);
    }
  };

  return (
    <>
      {/* Sort controls - separate dropdown and direction button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: isMobile ? "100%" : "auto",
        }}
      >
        <FormControl size="small" sx={{ minWidth: "120px", flexGrow: 1 }}>
          <InputLabel id="sort-order-label">Sort By</InputLabel>
          <Select
            labelId="sort-order-label"
            value={npcSortOrder}
            label="Sort By"
            onChange={(e) => handleSortChange(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SortIcon fontSize="small" color="action" />
              </InputAdornment>
            }
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="level">Level</MenuItem>
            <MenuItem value="species">Species</MenuItem>
            <MenuItem value="createdAt">Creation Date</MenuItem>
            <MenuItem value="updatedAt">Updated Date</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          onClick={handleSortDirectionChange}
          color={isDarkMode ? "white" : "primary"}
          size="small"
          sx={{
            border: 1,
            borderColor: "divider",
            p: 1,
          }}
        >
          {npcSortDirection === "asc" ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )}
        </IconButton>
      </Box>

      {/* Attitude filter as a select dropdown */}
      <FormControl
        size="small"
        sx={{ minWidth: isMobile ? "100%" : "150px", flexGrow: 1 }}
      >
        <InputLabel id="attitude-label">{t("npc_attitude_label")}</InputLabel>
        <Select
          labelId="attitude-label"
          id="attitude"
          value={npcAttitudeFilter}
          label={t("npc_attitude_label")}
          onChange={handleAttitudeChange}
          renderValue={(selected) => {
            const option = attitudeOptions.find(
              (opt) => opt.value === selected
            );
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option?.icon}
                <span>{option?.label}</span>
              </Box>
            );
          }}
        >
          {attitudeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option.icon}
                <span>{option.label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Villains as a toggle switch - now separated from attitude */}
      <FormControlLabel
        control={
          <Switch
            checked={showVillainsOnly}
            onChange={handleVillainToggle}
            size="small"
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <VillainIcon
              fontSize="small"
              color={showVillainsOnly ? "warning" : "action"}
            />
            <span>Villains only</span>
          </Box>
        }
        sx={{ ml: 0 }}
      />
      <FormControl
        size="small"
        sx={{ minWidth: isMobile ? "100%" : "150px", flexGrow: 1 }}
      >
        <InputLabel id="rank-label">Rank</InputLabel>
        <Select
          labelId="rank-label"
          id="rank"
          value={npcRank}
          label="Rank"
          onChange={handleRankChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="soldier">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("soldier").icon, {
                fontSize: "small",
                color: getRankIcon("soldier").color,
              })}
              <span>Soldier</span>
            </Box>
          </MenuItem>
          <MenuItem value="elite">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("elite").icon, {
                fontSize: "small",
                color: getRankIcon("elite").color,
              })}
              <span>Elite</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion1">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion1").icon, {
                fontSize: "small",
                color: getRankIcon("champion1").color,
              })}
              <span>Champion (1)</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion2">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion2").icon, {
                fontSize: "small",
                color: getRankIcon("champion2").color,
              })}
              <span>Champion (2)</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion3">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion3").icon, {
                fontSize: "small",
                color: getRankIcon("champion3").color,
              })}
              <span>Champion (3)</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion4">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion4").icon, {
                fontSize: "small",
                color: getRankIcon("champion4").color,
              })}
              <span>Champion (4)</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion5">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion5").icon, {
                fontSize: "small",
                color: getRankIcon("champion5").color,
              })}
              <span>Champion (5)</span>
            </Box>
          </MenuItem>
          <MenuItem value="champion6">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("champion6").icon, {
                fontSize: "small",
                color: getRankIcon("champion6").color,
              })}
              <span>Champion (6)</span>
            </Box>
          </MenuItem>
          <MenuItem value="companion">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("companion").icon, {
                fontSize: "small",
                color: getRankIcon("companion").color,
              })}
              <span>Companion</span>
            </Box>
          </MenuItem>
          <MenuItem value="groupvehicle">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {React.createElement(getRankIcon("groupvehicle").icon, {
                fontSize: "small",
                color: getRankIcon("groupvehicle").color,
              })}
              <span>Group Vehicle</span>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{ minWidth: isMobile ? "100%" : "150px", flexGrow: 1 }}
      >
        <InputLabel id="species-label">Species</InputLabel>
        <Select
          labelId="species-label"
          id="species"
          value={npcSpecies}
          label="Species"
          onChange={handleSpeciesChange}
          renderValue={(selected) => {
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>{selected ? selected : "All"}</span>
              </Box>
            );
          }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries({
            Beast: "Beast",
            Construct: "Construct",
            Demon: "Demon",
            Elemental: "Elemental",
            Humanoid: "Humanoid",
            Undead: "Undead",
            Plant: "Plant",
            Monster: "Monster",
          }).map(([species, label]) => (
            <MenuItem key={species} value={species}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {React.createElement(getSpeciesIcon(species), {
                  fontSize: "small",
                })}
                <span>{label}</span>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default NPCsSearchFilters;
