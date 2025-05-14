import React from "react";
import { Box, Grid, Stack } from "@mui/material";

/**
 * Component for displaying content items in either grid or list view
 *
 * @param {Object} props
 * @param {Array} props.items - Array of content items to display
 * @param {string} props.viewMode - Current display mode ('grid' or 'list')
 * @param {Array} props.selectedItems - Array of selected item IDs
 * @param {boolean} props.selectionMode - Flag indicating if selection mode is active
 * @param {Function} props.handleSelectItem - Handler for item selection toggle
 * @param {Function} props.handleUnlinkItem - Handler for unlinking single item
 * @param {Function} props.handleOpenMoveDialog - Handler for opening move dialog
 * @param {Array} props.folders - Array of all available folders
 * @param {Object|null} props.currentFolder - Currently selected folder object
 * @param {string} props.filterValue - Current filter search value
 * @param {React.Component} props.ItemCardComponent - Component for rendering grid items
 * @param {React.Component} props.ItemListComponent - Component for rendering list items
 * @param {React.Component} props.EmptyListComponent - Component for rendering empty state
 */
const ContentList = ({
  items,
  itemLabels,
  viewMode,
  selectedItems,
  selectionMode,
  handleSelectItem,
  handleUnlinkItem,
  handleOpenMoveDialog,
  folders,
  currentFolder,
  filterValue,
  ItemCardComponent,
  ItemListComponent,
  EmptyListComponent,
}) => {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", paddingTop: 1 }}>
      {items.length > 0 ? (
        viewMode === "grid" ? (
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                <ItemCardComponent
                  item={item}
                  onUnlink={handleUnlinkItem}
                  folders={folders}
                  onSelect={handleSelectItem}
                  isSelected={selectedItems.includes(item.id)}
                  selectionMode={selectionMode}
                  onMove={handleOpenMoveDialog}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={1}>
            {items.map((item) => (
              <ItemListComponent
                key={item.id}
                item={item}
                onUnlink={handleUnlinkItem}
                folders={folders}
                onSelect={handleSelectItem}
                isSelected={selectedItems.includes(item.id)}
                selectionMode={selectionMode}
                onMove={handleOpenMoveDialog}
              />
            ))}
          </Stack>
        )
      ) : (
        // Empty state component with context about current view
        <EmptyListComponent
          currentFolder={currentFolder}
          filterValue={filterValue}
          itemLabels={itemLabels}
        />
      )}
    </Box>
  );
};

export default ContentList;
