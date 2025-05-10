import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import React, { useState } from "react";
import {Box, useTheme, Typography, Tooltip, ToggleButtonGroup, ToggleButton} from '@mui/material';
import { styled } from "@mui/material/styles";
import ExplorerCard from '../../common/ExplorerCard.jsx';
import NpcCardHeader from "./NpcCardHeader";
import NpcCardContent from "./NpcCardContent";
import NpcDetailDialog from "./NpcDetailDialog";
import { useNpcActions } from "./hooks/useNpcActions";
import { useNpcStore } from "./stores/npcDataStore";

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

const NpcCard = ({
  item,
  onUnlink,
  onNotes,
  onMove,
  onSelect,
  isSelected = false,
  selectionMode = false,
}) => {
  const { campaignId, loadNpcs, showSnackbar } = useNpcStore();
  const { handleEditNpc, handleSetAttitude } = useNpcActions(
    campaignId,
    loadNpcs,
    showSnackbar
  );
  const theme = useTheme();
  const isSimple = item.isSimplified;
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currentAttitude, setCurrentAttitude] = useState(item.attitude);

  const handleDetailsOpen = () => {
    if (isSimple) return;
    setDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
  };

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
  <React.Fragment>
    <ExplorerCard
      item={item}
      editText="Edit NPC"
      deleteText={isSimple ? 'Delete NPC' : 'Unlink NPC'}
      onUnlink={onUnlink}
      onEdit={handleEditNpc}
      onNotes={onNotes}
      onMove={onMove}
      onDetails={handleDetailsOpen}
      onSelect={onSelect}
      isSelected={isSelected}
      selectionMode={selectionMode}
      cardContent={(
        <>
          {/* Card Header with Image */}
          <NpcCardHeader imageUrl={item.imgurl} />

          {/* Card Content with NPC Details */}
          <NpcCardContent
            name={item.name}
            level={item.lvl}
            species={item.species}
            rank={item.rank}
            villain={item.villain}
            isSimple={isSimple}
          />
        </>
      )}
      additionalMenuItems={
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
      }
    ></ExplorerCard>

      {/* NPC Details Dialog */}
      <NpcDetailDialog
        open={detailsDialogOpen}
        onClose={handleDetailsClose}
        npc={item}
      />
    </React.Fragment>
  );
};

export default NpcCard;
