// src/stores/folderStore.js
import { create } from 'zustand';
import {replacePlaceholders, t} from '../../../translation/translate.jsx';
import {
  addFolder,
  deleteFolder,
  getFoldersForCampaign,
  updateCampaignFolder,
  updateFolder
} from '../../../utility/db/folder.js';

export const EntityTypes = {
  NPC: 'npc',
  Note: 'note',
  Location: 'location'
}

export const useFoldersStore = create((set, get) => ({
  // State
  folders: [],
  isNewFolderDialogOpen: false,
  newFolderName: "",
  isDeleteFolderDialogOpen: false,
  folderToDeleteConfirmation: null,
  isRenameFolderDialogOpen: false,
  folderToRename: null,
  renamedFolderName: "",
  campaignId: null,

  // Setters
  setCampaignId: (id) => set({ campaignId: id }),
  setFolders: (folders) => set({ folders: folders }),
  setIsNewFolderDialogOpen: (isOpen) => set({ isNewFolderDialogOpen: isOpen }),
  setNewFolderName: (name) => set({ newFolderName: name }),
  setIsDeleteFolderDialogOpen: (isOpen) => set({ isDeleteFolderDialogOpen: isOpen }),
  setFolderToDeleteConfirmation: (folder) => set({ folderToDeleteConfirmation: folder }),
  setIsRenameFolderDialogOpen: (isOpen) => set({ isRenameFolderDialogOpen: isOpen }),
  setFolderToRename: (folder) => set({ folderToRename: folder }),
  setRenamedFolderName: (name) => set({ renamedFolderName: name }),

  // Actions
  fetchFolders: async () => {
    const campaignId = get().campaignId;
    try {
      const foldersList = await getFoldersForCampaign(campaignId);
      set({ folders: foldersList });
      return foldersList;
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }
  },

  createFolder: async (parentId) => {
    const { newFolderName, campaignId } = get();
    const showSnackbar = get().showSnackbar;

    try {
      await addFolder({
        campaignId: campaignId,
        name: newFolderName,
        parentId: parentId,
      });

      // Refresh folders list
      await get().fetchFolders();
      set({
        isNewFolderDialogOpen: false,
        newFolderName: ""
      });

      if (showSnackbar) showSnackbar("Folder created successfully", "success");
      return true;
    } catch (error) {
      console.error("Error creating folder:", error);
      if (showSnackbar) showSnackbar("Failed to create folder", "error");
      return false;
    }
  },

  prepareRenameFolder: (folderId) => {
    const { folders } = get();
    const { showSnackbar } = get();

    const findFolder = (currFolders, folderId) => {
      for (const folder of currFolders) {
        if (folder.id === folderId) {
          return folder;
        }
        if (folder.children && folder.children.length > 0) {
          const found = findFolder(folder.children, folderId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const folder = findFolder(folders, folderId);
    if (folder) {
      set({
        folderToRename: folder,
        renamedFolderName: folder.name,
        isRenameFolderDialogOpen: true
      });
    } else {
      console.error("Folder not found for renaming:", folderId);
      if (showSnackbar) showSnackbar("Could not find the folder to rename.", "error");
    }
  },

  confirmRenameFolder: async () => {
    const { folderToRename, renamedFolderName, campaignId } = get();
    const { showSnackbar } = get();

    if (!folderToRename || !renamedFolderName.trim()) return false;

    try {
      await updateFolder({
        id: folderToRename.id,
        campaignId: folderToRename.campaignId || campaignId,
        name: renamedFolderName.trim(),
        parentId: folderToRename.parentId,
      });

      if (showSnackbar) showSnackbar("Folder renamed successfully", "success");

      // Refresh folders list
      await get().fetchFolders();
      set({
        isRenameFolderDialogOpen: false,
        folderToRename: null,
        renamedFolderName: ""
      });

      return true;
    } catch (error) {
      console.error("Error renaming folder:", error);
      if (showSnackbar) showSnackbar("Failed to rename folder", "error");
      return false;
    }
  },

  prepareDeleteFolder: (folderId) => {
    const { folders } = get();

    const collectFolderIdsToDelete = (currFolders, targetId, idsToDelete = []) => {
      for (let folder of currFolders) {
        if (folder.id === targetId) {
          // Add this folder to delete list
          idsToDelete.push(folder.id);

          // Add all children recursively
          if (folder.children && folder.children.length > 0) {
            folder.children.forEach((child) => {
              idsToDelete.push(child.id);
              // Process nested children
              if (child.children && child.children.length > 0) {
                collectFolderIdsToDelete([child], child.id, idsToDelete);
              }
            });
          }
          return idsToDelete;
        }

        // Check children if current folder is not a match
        if (folder.children && folder.children.length > 0) {
          const foundInChildren = collectFolderIdsToDelete(
            folder.children,
            targetId,
            idsToDelete
          );
          // If found in children, return the result immediately
          if (foundInChildren.length > idsToDelete.length) {
            return foundInChildren;
          }
        }
      }
      return idsToDelete;
    };

    const folderIdsToDelete = collectFolderIdsToDelete(folders, folderId);
    if (folderIdsToDelete.length > 0) {
      set({
        folderToDeleteConfirmation: folderIdsToDelete,
        isDeleteFolderDialogOpen: true
      });
    } else {
      console.warn("No folders found to delete for ID:", folderId);
    }
  },

  confirmDeleteFolder: async () => {
    const { folderToDeleteConfirmation, folders, campaignId } = get();
    const { showSnackbar, loadNpcs } = get();

    if (!folderToDeleteConfirmation) return false;

    const folderIdsToDelete = Array.isArray(folderToDeleteConfirmation)
      ? folderToDeleteConfirmation
      : [folderToDeleteConfirmation];
    const originalFolders = JSON.parse(JSON.stringify(folders)); // Deep copy for revert

    // Filter deleted folders
    const filterDeletedFolders = (folders) => {
      return folders.reduce((acc, folder) => {
        if (!folderIdsToDelete.includes(folder.id)) {
          if (folder.children && folder.children.length > 0) {
            folder.children = filterDeletedFolders(folder.children);
          }
          acc.push(folder);
        }
        return acc;
      }, []);
    };

    // Apply optimistic update
    set({ folders: filterDeletedFolders([...folders]) });

    try {
      // Delete all folders on the server
      for (const folderId of folderIdsToDelete) {
        await deleteFolder(folderId, campaignId);
      }

      if (showSnackbar) showSnackbar("Folder(s) deleted successfully", "success");
      return true;
    } catch (error) {
      console.error("Failed to delete folder:", error);
      if (showSnackbar) showSnackbar(`Failed to delete folder: ${error.message}`, "error");
      // Revert the optimistic update
      set({ folders: originalFolders });
      return false;
    } finally {
      set({
        isDeleteFolderDialogOpen: false,
        folderToDeleteConfirmation: null
      });

      // Refresh folders from server to ensure sync
      try {
        await get().fetchFolders();
        // Also reload entities in case some were moved out of deleted folders implicitly
        if (loadNpcs) await loadNpcs();
      } catch (refreshError) {
        console.error("Failed to refresh folders/entities after delete:", refreshError);
        if (showSnackbar) showSnackbar("Failed to refresh data after deletion.", "warning");
      }
    }
  },

  cancelDeleteFolder: () => {
    set({
      isDeleteFolderDialogOpen: false,
      folderToDeleteConfirmation: null
    });
  },

  getFolderName: (folderId) => {
    const findFolder = (folders, folderId) => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          return folder;
        }
        if (folder.children && folder.children.length > 0) {
          const found = findFolder(folder.children, folderId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    const folder = findFolder(get().folders, folderId);
    if (folder) {
      return folder.name;
    }
    return null;
  },

  // Actions
  moveNpcToFolder: async (npcId, folderId) => {
    const { campaignId } = get();
    const { showSnackbar, loadNpcs } = get();

    try {
      await updateCampaignFolder(npcId, 'npc', campaignId, folderId);
      if (showSnackbar) showSnackbar(t('npc_move_success'), "success");
      if (loadNpcs) await loadNpcs(); // Reload NPCs to reflect the change
      return true;
    } catch (error) {
      console.error("Error moving NPC to folder:", error);
      if (showSnackbar) showSnackbar(
        replacePlaceholders(t('npc_move_error'), { error: error.message }),
        "error"
      );
      return false;
    }
  },

  // Utils
  setShowSnackbar: (showSnackbar) => set({ showSnackbar }),
  setLoadNpcs: (loadNpcs) => set({ loadNpcs }),

  // These functions need to be injected when initializing the store
  showSnackbar: null,
  loadNpcs: null,
}));
