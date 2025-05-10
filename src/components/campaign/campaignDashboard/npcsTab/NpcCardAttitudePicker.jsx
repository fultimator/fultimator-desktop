import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import {Box, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {useState} from 'react';
import {useNpcActions} from './hooks/useNpcActions.js';
import {useNpcStore} from './stores/npcDataStore.js';


const ICON_SIZE = 18;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: 0,
    padding: theme.spacing(0.5),
    border: 0,
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  "&.Mui-selected": {
    backgroundColor: "transparent",
  },
  "& svg": {
    fontSize: ICON_SIZE,
  },
}));

export const NpcCardAttitudePicker = ({item}) => {
  const theme = useTheme();
  const { campaignId, loadNpcs, showSnackbar } = useNpcStore();
  const { handleSetAttitude } = useNpcActions(
    campaignId,
    loadNpcs,
    showSnackbar
  );

  const [currentAttitude, setCurrentAttitude] = useState(item.attitude);

  const handleAttitudeChange = (event, newAttitude) => {
    if (newAttitude !== null) {
      setCurrentAttitude(newAttitude);
      handleSetAttitude(item.id, newAttitude);
    }
  };

  const getAttitudeColor = (attitudeValue) => {
    const isSelected = currentAttitude === attitudeValue;

    switch (attitudeValue) {
      case "friendly":
        return isSelected
          ? theme.palette.success.main
          : theme.palette.text.disabled;
      case "neutral":
        return isSelected
          ? theme.palette.secondary.main
          : theme.palette.text.disabled;
      case "hostile":
        return isSelected
          ? theme.palette.error.main
          : theme.palette.text.disabled;
      default:
        return theme.palette.text.disabled;
    }
  };

  return (
    <Box sx={{ px: 1, py: 0.5 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ pl: 1, mb: 1, fontSize: "0.75rem" }}
      >
        NPC ATTITUDE
      </Typography>

      <StyledToggleButtonGroup
        value={currentAttitude}
        exclusive
        onChange={handleAttitudeChange}
        aria-label="NPC attitude"
        size="small"
        fullWidth
      >
        <StyledToggleButton value="friendly" aria-label="friendly attitude">
          <Tooltip title="Friendly" arrow>
            <SentimentSatisfiedAltIcon
              sx={{ color: getAttitudeColor("friendly") }}
            />
          </Tooltip>
        </StyledToggleButton>

        <StyledToggleButton value="neutral" aria-label="neutral attitude">
          <Tooltip title="Neutral" arrow>
            <SentimentNeutralIcon
              sx={{ color: getAttitudeColor("neutral") }}
            />
          </Tooltip>
        </StyledToggleButton>

        <StyledToggleButton value="hostile" aria-label="hostile attitude">
          <Tooltip title="Hostile" arrow>
            <SentimentVeryDissatisfiedIcon
              sx={{ color: getAttitudeColor("hostile") }}
            />
          </Tooltip>
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  )
};
