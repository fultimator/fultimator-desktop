import React, { useState } from "react";
import {
  ListItem,
  Box,
  Checkbox,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExplorerCardActions from './ExplorerCardActions.jsx';

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: "background-color 0.2s",
  border: selected
    ? `1px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: selected
    ? theme.palette.action.selected
    : theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SelectionCheckbox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const ExplorerListItem = ({
  item,
  editText,
  deleteText,
  content,
  onUnlink,
  onEdit,
  onNotes,
  onMove,
  onSelect,
  onDetails,
  isSimple,
  isSelected = false,
  selectionMode = false,
  additionalMenuItems,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(item.id, !isSelected);
    }
  };

  const handleListItemClick = () => {
    if (selectionMode && onSelect) {
      onSelect(item.id, !isSelected);
    } else if (isSimple) {
      onEdit(item);
    } else {
      onDetails();
    }
  };

  return (
    <React.Fragment>
      <StyledListItem
        selected={isSelected}
        onClick={handleListItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          {/* Selection checkbox - visible when in selection mode or on hover */}
          <Fade in={selectionMode || isHovered || isSelected}>
            <SelectionCheckbox>
              <Checkbox
                checked={isSelected}
                onChange={handleCheckboxChange}
                onClick={(e) => e.stopPropagation()}
                size="small"
              />
            </SelectionCheckbox>
          </Fade>

          {content}

          {/* Action buttons */}
          <ExplorerCardActions
            itemId={item.id}
            editText={editText}
            deleteText={deleteText}
            onEdit={() => onEdit && onEdit(item)}
            onUnlink={() => onUnlink && onUnlink(item.id)}
            onNotes={() => onNotes && onNotes(item)}
            onDetails={(e) => onDetails && onDetails(e, item)}
            onMove={() => onMove && onMove(item.id)}
            isSimple={isSimple}
            additionalActions={additionalMenuItems}
            mode="list"
          />
        </Box>
      </StyledListItem>
    </React.Fragment>
  );
};

export default ExplorerListItem;
