import React, { useState } from "react";
import {
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ExplorerListItem from '../../common/ExplorerListItem.jsx';
import {NpcCardAttitudePicker} from './NpcCardAttitudePicker.jsx';
import NpcDetailDialog from "./NpcDetailDialog";
import { getSpeciesIcon, getRankIcon } from "../../../../libs/npcIcons";
import { useNpcActions } from "./hooks/useNpcActions";
import { useNpcStore } from "./stores/npcDataStore";

// Standardized icon size constant
const ICON_SIZE = 16;

const LevelBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "12px",
  padding: theme.spacing(0, 1),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  height: 20,
  minWidth: 24,
  fontSize: "0.75rem",
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const getRankName = (rank) => {
  if (rank && rank.startsWith("champion")) {
    const level = rank.charAt(rank.length - 1);
    return `Champion ${level}`;
  }
  return rank ? rank.charAt(0).toUpperCase() + rank.slice(1) : "";
};

const NpcListItem = ({
  item,
  onUnlink,
  onNotes,
  onMove,
  onSelect,
  isSelected = false,
  selectionMode = false,
}) => {
  const { campaignId, loadNpcs, showSnackbar } = useNpcStore();
  const { handleEditNpc } = useNpcActions(
    campaignId,
    loadNpcs,
    showSnackbar
  );
  const isSimple = item.isSimplified;
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);


  const handleDetailsOpen = () => {
    setDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
  };

  const SpeciesIcon = getSpeciesIcon(item.species);

  // Get rank icon and color
  const rankInfo = getRankIcon(item.rank || "soldier");
  const RankIcon = rankInfo.icon;
  const rankColor = rankInfo.color;
  const rankName = getRankName(item.rank || "soldier");

  return (
    <React.Fragment>
      <ExplorerListItem
        item={item}
        editText="Edit NPC"
        deleteText={isSimple ? 'Delete NPC' : 'Unlink NPC'}
        onUnlink={onUnlink}
        onEdit={handleEditNpc}
        onNotes={onNotes}
        onMove={onMove}
        onDetails={handleDetailsOpen}
        isSimple={isSimple}
        onSelect={onSelect}
        isSelected={isSelected}
        selectionMode={selectionMode}
        content={(
          <>
            {/* Avatar */}
            <ListItemAvatar>
              <Avatar
                alt={item.name}
                src={item.imgurl || "/logo192.png"}
                variant="rounded"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemAvatar>

            {/* NPC Info */}
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.name}
                </Typography>
              }
              secondary={
                <IconContainer>
                  <LevelBadge>{item.lvl}</LevelBadge>

                  <Tooltip title={rankName}>
                    <Box sx={{ color: rankColor }}>
                      <RankIcon sx={{ fontSize: ICON_SIZE }} />
                    </Box>
                  </Tooltip>

                  {SpeciesIcon && (
                    <Tooltip title={item.species}>
                      <Box>
                        <SpeciesIcon sx={{ fontSize: ICON_SIZE }} />
                      </Box>
                    </Tooltip>
                  )}

                  {item.villain && (
                    <Tooltip title={`Villain: ${item.villain}`}>
                      <ReportProblemIcon
                        sx={{
                          fontSize: ICON_SIZE,
                          color: (theme) => theme.palette.error.main,
                        }}
                      />
                    </Tooltip>
                  )}
                </IconContainer>
              }
            />
          </>
        )}
        additionalMenuItems={<NpcCardAttitudePicker item={item} />}
      />

      {/* NPC Details Dialog */}
      <NpcDetailDialog
        open={detailsDialogOpen}
        onClose={handleDetailsClose}
        npc={item}
      />
    </React.Fragment>
  );
};

export default NpcListItem;
