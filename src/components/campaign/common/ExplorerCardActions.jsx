import React, { useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { LinkOff, Delete as DeleteIcon } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";

// Standardized icon size
const ICON_SIZE = 18;

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(0.75, 1),
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[50],
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ActionButtonsGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 6,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.02)",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
  },
  "& svg": {
    fontSize: ICON_SIZE,
  },
}));

const ExplorerCardActions = ({
  itemId,
  editText = 'Edit',
  deleteText = 'Delete',
  onEdit,
  onUnlink,
  onNotes,
  onDetails,
  onMove,
  additionalActions,
  isSimple,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <ActionsContainer onClick={(e) => e.stopPropagation()}>
      <ActionButtonsGroup>
        <Tooltip title="Edit NPC" arrow>
          <StyledIconButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            size="small"
          >
            <EditIcon />
          </StyledIconButton>
        </Tooltip>

        <Tooltip title="Notes" arrow>
          <StyledIconButton
            onClick={(e) => {
              e.stopPropagation();
              onNotes();
            }}
            size="small"
          >
            <StickyNote2Icon />
          </StyledIconButton>
        </Tooltip>

        {!isSimple && (
          <Tooltip title="View Details" arrow>
            <StyledIconButton
              onClick={(e) => {
                e.stopPropagation();
                onDetails(e);
              }}
              size="small"
            >
              <SearchIcon />
            </StyledIconButton>
          </Tooltip>
        )}
      </ActionButtonsGroup>

      <Tooltip title="More options" arrow>
        <StyledIconButton
          aria-label="more options"
          id={`item-menu-button-${itemId}`}
          aria-controls={menuOpen ? `item-menu-${itemId}` : undefined}
          aria-expanded={menuOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={(e) => handleMenuClick(e)}
          size="small"
        >
          <MoreVertIcon />
        </StyledIconButton>
      </Tooltip>

      <Menu
        id={`item-menu-${itemId}`}
        MenuListProps={{
          "aria-labelledby": `item-menu-button-${itemId}`,
          dense: true,
        }}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={(e) => handleMenuClose(e)}
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 2,
            minWidth: 200,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={(e) => {
            onEdit();
            handleMenuClose(e);
          }}
        >
          <ListItemIcon>
            <EditIcon sx={{ fontSize: ICON_SIZE }} />
          </ListItemIcon>
          <ListItemText>{editText}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            onUnlink();
            handleMenuClose(e);
          }}
        >
          <ListItemIcon>
            {isSimple ? (
              <DeleteIcon
                sx={{
                  fontSize: ICON_SIZE,
                  color: theme.palette.error.main,
                }}
              />
            ) : (
              <LinkOff
                sx={{
                  fontSize: ICON_SIZE,
                  color: theme.palette.error.main,
                }}
              />
            )}
          </ListItemIcon>
          <ListItemText>
            {deleteText}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            onMove();
            handleMenuClose(e);
          }}
        >
          <ListItemIcon>
            <FolderIcon sx={{ fontSize: ICON_SIZE }} />
          </ListItemIcon>
          <ListItemText>Move to Folder</ListItemText>
        </MenuItem>

        {
          additionalActions && (
            <>
              <Divider sx={{ my: 1 }} />
              {additionalActions}
            </>
          )
        }

      </Menu>
    </ActionsContainer>
  );
};

export default ExplorerCardActions;
