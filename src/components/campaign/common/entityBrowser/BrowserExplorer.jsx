import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {useFoldersStore} from '../../stores/folderStore.js';
import Explorer from "../Explorer";

const BrowserExplorer = ({
  items,
  itemCardComponent,
  itemListComponent,
  unlinkMultipleItems,
  handleMoveItem,
  itemLabels = {
   singular: "item",
   plural: "items",
   translationKey: "explorer_item_generic",
  },
  selectedFolderId,
  setSelectedFolderId,
  showAllFolders,
  setShowAllFolders,
}) => {
  const {
    folders,
    prepareRenameFolder,
    prepareDeleteFolder,
    isNewFolderDialogOpen,
    setIsNewFolderDialogOpen,
    createFolder,
    newFolderName,
    setNewFolderName,
    isRenameFolderDialogOpen,
    setIsRenameFolderDialogOpen,
    setFolderToRename,
    renamedFolderName,
    setRenamedFolderName,
    confirmRenameFolder,
    isDeleteFolderDialogOpen,
    confirmDeleteFolder,
    cancelDeleteFolder,
    getFolderName,
  } = useFoldersStore();

  const onFolderDelete = async () => {
    await confirmDeleteFolder();
    setSelectedFolderId(null);
  }

  // Initialize viewMode from localStorage or default to "grid"
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem(`${itemLabels.singular}ListViewMode`);
    return savedViewMode || "grid"; // Default to 'grid' if no saved preference
  });

  // Add selection state
  const [selectedNpcs, setSelectedNpcs] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Track previous folder ID to detect changes
  const [prevFolderId, setPrevFolderId] = useState(selectedFolderId);

  // Update localStorage whenever viewMode changes
  useEffect(() => {
    localStorage.setItem("npcListViewMode", viewMode);
  }, [viewMode]);

  // Clear selection when folder changes
  useEffect(() => {
    if (prevFolderId !== selectedFolderId) {
      setSelectedNpcs([]);
      setSelectionMode(false);
      setPrevFolderId(selectedFolderId);
    }
  }, [selectedFolderId, prevFolderId]);

  // Automatically enable selection mode when there are selected NPCs
  useEffect(() => {
    if (selectedNpcs.length > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (selectedNpcs.length === 0 && selectionMode) {
      setSelectionMode(false);
    }
  }, [selectedNpcs, selectionMode]);

  return (
    <Explorer
      folders={folders}
      selectedFolderId={selectedFolderId}
      setSelectedFolderId={setSelectedFolderId}
      showAllFolders={showAllFolders}
      setShowAllFolders={setShowAllFolders}
      viewMode={viewMode}
      setViewMode={setViewMode}
      items={items}
      setIsNewFolderDialogOpen={setIsNewFolderDialogOpen}
      moveItemToFolder={handleMoveItem}
      unlinkMultipleItems={unlinkMultipleItems}
      prepareRenameFolder={prepareRenameFolder}
      prepareDeleteFolder={prepareDeleteFolder}
      ItemCardComponent={itemCardComponent}
      ItemListComponent={itemListComponent}
      EmptyListComponent={EmptyEntityList}
      itemLabels={itemLabels}
      maxFolderNameLength = {50}
      isNewFolderDialogOpen = {isNewFolderDialogOpen}
      newFolderName = {newFolderName}
      setNewFolderName = {setNewFolderName}
      createFolder = {createFolder}
      isRenameFolderDialogOpen = {isRenameFolderDialogOpen}
      setIsRenameFolderDialogOpen = {setIsRenameFolderDialogOpen}
      setFolderToRename = {setFolderToRename}
      renamedFolderName = {renamedFolderName}
      setRenamedFolderName = {setRenamedFolderName}
      confirmRenameFolder = {confirmRenameFolder}
      isDeleteFolderDialogOpen = {isDeleteFolderDialogOpen}
      confirmDeleteFolder = {onFolderDelete}
      cancelDeleteFolder = {cancelDeleteFolder}
      getFolderName = {getFolderName}
    />
  );
};

const EmptyEntityList = ({ currentFolder, itemLabels }) => {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 1,
        mt: 2,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {currentFolder
          ? `No ${itemLabels.plural} in folder "${currentFolder.name}"`
          : `No ${itemLabels.plural} match the current search.`}
      </Typography>
    </Box>
  );
};

export default BrowserExplorer;
