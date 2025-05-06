import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {useFoldersStore} from '../../stores/folderStore.js';
import NpcCard from "./NpcCard";
import NpcListItem from "./NpcListItem";
import { useNpcFiltersStore } from "./stores/npcFiltersStore";
import { useNpcStore } from "./stores/npcDataStore";
import Explorer from "../../common/Explorer";

const NpcExplorer = ({ campaignNpcs, handleToggleNpc }) => {
  const { unlinkMultipleNpcs } = useNpcStore();
  const {
    selectedNpcFolderId,
    getDisplayedNpcs,
    setSelectedNpcFolderId,
    showAllFolders,
    setShowAllFolders,
  } = useNpcFiltersStore();
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
    moveNpcToFolder,
    getFolderName,
  } = useFoldersStore();

  const onFolderDelete = async () => {
    await confirmDeleteFolder();
    setSelectedNpcFolderId(null);
  }

  // Initialize viewMode from localStorage or default to "grid"
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem("npcListViewMode");
    return savedViewMode || "grid"; // Default to 'grid' if no saved preference
  });

  // Add selection state
  const [selectedNpcs, setSelectedNpcs] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Track previous folder ID to detect changes
  const [prevFolderId, setPrevFolderId] = useState(selectedNpcFolderId);

  // Update localStorage whenever viewMode changes
  useEffect(() => {
    localStorage.setItem("npcListViewMode", viewMode);
  }, [viewMode]);

  // Clear selection when folder changes
  useEffect(() => {
    if (prevFolderId !== selectedNpcFolderId) {
      setSelectedNpcs([]);
      setSelectionMode(false);
      setPrevFolderId(selectedNpcFolderId);
    }
  }, [selectedNpcFolderId, prevFolderId]);

  // Automatically enable selection mode when there are selected NPCs
  useEffect(() => {
    if (selectedNpcs.length > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (selectedNpcs.length === 0 && selectionMode) {
      setSelectionMode(false);
    }
  }, [selectedNpcs, selectionMode]);

  // Get displayed NPCs using the store's method
  const displayedNpcs = getDisplayedNpcs(campaignNpcs);

  const itemLabels = {
    singular: "NPC",
    plural: "NPCs",
    translationKey: "explorer_item_npc"
  };

  return (
    <Explorer
      folders={folders}
      selectedFolderId={selectedNpcFolderId}
      setSelectedFolderId={setSelectedNpcFolderId}
      showAllFolders={showAllFolders}
      setShowAllFolders={setShowAllFolders}
      viewMode={viewMode}
      setViewMode={setViewMode}
      items={displayedNpcs}
      setIsNewFolderDialogOpen={setIsNewFolderDialogOpen}
      moveItemToFolder={moveNpcToFolder}
      unlinkMultipleItems={unlinkMultipleNpcs}
      prepareRenameFolder={prepareRenameFolder}
      prepareDeleteFolder={prepareDeleteFolder}
      handleUnlinkItem={handleToggleNpc}
      ItemCardComponent={NpcCard}
      ItemListComponent={NpcListItem}
      EmptyListComponent={EmptyNpcsList}
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

const EmptyNpcsList = ({ currentFolder }) => {
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
          ? `No NPCs in folder "${currentFolder.name}"`
          : "No NPCs match the current search."}
      </Typography>
    </Box>
  );
};

export default NpcExplorer;
