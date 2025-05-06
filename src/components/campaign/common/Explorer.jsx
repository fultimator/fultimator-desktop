import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
  Grid,
  Button,
} from "@mui/material";
import {
  FolderOpen as FolderOpenIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  ViewList as ViewListIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FolderSpecial as FolderSpecialIcon,
  NavigateNext as NavigateNextIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import FolderIcon from "@mui/icons-material/Folder";
import {useFoldersStore} from '../stores/folderStore.js';
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import FolderSidebar from "./FolderSidebar";
import MoveFolderDialog from "./MoveFolderDialog";
import FolderHeader from "./FolderHeader";
import ContentToolbar from "./ContentToolbar";
import ContentList from "./ContentList";
import {
  useTranslate,
  replacePlaceholders,
} from "../../../translation/translate";
import FolderNameDialogComponent from "./FolderNameDialogComponent";
import DeleteFolderDialogComponent from "./DeleteFolderDialogComponent";

/**
 * Explorer component for managing folders and content items with a hierarchical structure.
 * Provides a UI for browsing, selecting, moving, and managing items within folders.
 *
 * @param {Object} props - Component props
 * @param {Array|null} props.types - The types of the folder
 * @param {string|null} props.selectedFolderId - ID of currently selected folder
 * @param {Function} props.setSelectedFolderId - Function to update selected folder
 * @param {boolean} props.showAllFolders - Whether to show all folders or only the current folder tree
 * @param {Function} props.setShowAllFolders - Function to toggle showing all folders
 * @param {string} props.rootFolderName - Name of the root folder
 * @param {boolean} props.collapsibleSidebar - Whether the sidebar can be collapsed
 * @param {Object} props.sidebarInitialExpandedState - Initial expanded state of folders in sidebar
 * @param {Function} props.onSidebarFolderSelect - Callback when a folder is selected in sidebar
 * @param {string} props.viewMode - Current view mode ('grid' or 'list')
 * @param {Function} props.setViewMode - Function to update view mode
 * @param {Array} props.items - Content items to display in current folder
 * @param {boolean} props.isNewFolderDialogOpen - Whether new folder dialog is open
 * @param {string} props.newFolderName - New folder name input value
 * @param {Function} props.setNewFolderName - Function to update new folder name
 * @param {Function} props.setIsNewFolderDialogOpen - Function to toggle new folder dialog
 * @param {Function} props.createFolder - Function to create a new folder
 * @param {boolean} props.isRenameFolderDialogOpen - Whether rename folder dialog is open
 * @param {Function} props.setIsRenameFolderDialogOpen - Function to toggle rename folder dialog
 * @param {Function} props.setFolderToRename - Function to set folder to rename
 * @param {string} props.renamedFolderName - Renamed folder name input value
 * @param {Function} props.setRenamedFolderName - Function to update renamed folder name
 * @param {Function} props.confirmRenameFolder - Function to confirm folder rename
 * @param {boolean} props.isDeleteFolderDialogOpen - Whether delete folder dialog is open
 * @param {Function} props.confirmDeleteFolder - Function to confirm folder deletion
 * @param {Function} props.cancelDeleteFolder - Function to cancel folder deletion
 * @param {Function} props.moveItemToFolder - Function to move an item to a different folder
 * @param {Function} props.unlinkMultipleItems - Function to unlink multiple items
 * @param {Function} props.prepareRenameFolder - Function to prepare renaming a folder
 * @param {Function} props.prepareDeleteFolder - Function to prepare deleting a folder
 * @param {Function} props.handleUnlinkItem - Function to unlink a single item
 * @param {string} props.filterValue - Current filter value for filtering items
 * @param {React.Component} props.ItemCardComponent - Component to render an item in card view
 * @param {React.Component} props.ItemListComponent - Component to render an item in list view
 * @param {React.Component} props.EmptyListComponent - Component to render when no items exist
 * @param {Object} props.itemLabels - Labels for items in singular and plural forms
 * @param {string} props.itemLabels.singular - Singular form of item label (e.g., "character")
 * @param {string} props.itemLabels.plural - Plural form of item label (e.g., "characters")
 * @param {string} props.itemLabels.translationKey - Base translation key for item labels
 * @param {Object} props.headerCustomIcons - Custom icons for header components
 * @param {React.ReactNode} props.headerCustomIcons.root - Icon for root folder
 * @param {React.ReactNode} props.headerCustomIcons.folder - Icon for regular folders
 * @param {React.ReactNode} props.headerCustomIcons.allFolders - Icon for "All" folders view
 * @param {Object} props.breadcrumbsFolderIcons - Custom icons for breadcrumbs
 * @param {React.ReactNode} props.breadcrumbsFolderIcons.root - Icon for root in breadcrumbs
 * @param {React.ReactNode} props.breadcrumbsFolderIcons.folder - Icon for folders in breadcrumbs
 * @param {React.ReactNode} props.breadcrumbsFolderIcons.allFolders - Icon for "All" in breadcrumbs
 * @param {Object} props.toolbarCustomIcons - Custom icons for toolbar actions
 * @param {React.ReactNode} props.toolbarCustomIcons.move - Icon for move action
 * @param {React.ReactNode} props.toolbarCustomIcons.unlink - Icon for unlink action
 * @param {React.ReactNode} props.toolbarCustomIcons.clear - Icon for clear selection action
 * @param {Object} props.moveDialogCustomIcons - Custom icons for move dialog
 * @param {React.ReactNode} props.moveDialogCustomIcons.root - Icon for root folder in move dialog
 * @param {React.ReactNode} props.moveDialogCustomIcons.folder - Icon for regular folders in move dialog
 * @param {React.ReactNode} props.moveDialogCustomIcons.current - Icon for current folder in move dialog
 * @param {React.ReactNode} props.moveDialogCustomIcons.breadcrumbSeparator - Icon for breadcrumb separator in move dialog
 * @param {string} props.moveDialogSize - Size of the move dialog ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {number} props.moveDialogTreeHeight - Height of the folder tree in move dialog
 * @param {number} props.maxFolderNameLength - Maximum length for folder names
 * @param {string} props.folderNameDialogError - Error message for folder name dialog
 * @param {string} props.folderNameDialogTitle - Title for folder name dialog
 * @param {string} props.folderNameDialogConfirmButtonText - Confirm button text for folder name dialog
 * @param {string} props.folderNameDialogCancelButtonText - Cancel button text for folder name dialog
 * @param {string} props.renameFolderDialogError - Error message for rename folder dialog
 * @param {string} props.renameFolderDialogTitle - Title for rename folder dialog
 * @param {string} props.renameFolderDialogConfirmButtonText - Confirm button text for rename folder dialog
 * @param {string} props.renameFolderDialogCancelButtonText - Cancel button text for rename folder dialog
 * @param {string} props.deleteFolderDialogTitle - Title for delete folder dialog
 * @param {string} props.deleteFolderDialogMessage - Message shown in delete folder dialog
 * @param {string} props.deleteFolderDialogConfirmButtonText - Confirm button text for delete folder dialog
 * @param {string} props.deleteFolderDialogCancelButtonText - Cancel button text for delete folder dialog
 * @returns {React.ReactElement} The Explorer component
 */
const Explorer = ({
  selectedFolderId = null,
  setSelectedFolderId,
  showAllFolders = false,
  setShowAllFolders,
  rootFolderName = "",
  collapsibleSidebar = true,
  sidebarInitialExpandedState = {},
  onSidebarFolderSelect = null,

  // View mode props
  viewMode = "grid",
  setViewMode,

  // Content items props
  items = [],
  filterValue = "",

  // Folder operation props
  isNewFolderDialogOpen = false,
  newFolderName = "",
  setNewFolderName,
  setIsNewFolderDialogOpen,
  createFolder,
  isRenameFolderDialogOpen = false,
  setIsRenameFolderDialogOpen,
  setFolderToRename,
  renamedFolderName = "",
  setRenamedFolderName,
  confirmRenameFolder,
  isDeleteFolderDialogOpen = false,
  confirmDeleteFolder,
  cancelDeleteFolder,

  // Item operation props
  moveItemToFolder,
  unlinkMultipleItems,
  prepareRenameFolder,
  prepareDeleteFolder,
  handleUnlinkItem,

  // Component props
  ItemCardComponent,
  ItemListComponent,
  EmptyListComponent,

  // Label and icon props
  itemLabels = {
    singular: "item",
    plural: "items",
    translationKey: "explorer_item_generic",
  },
  headerCustomIcons = {
    root: <HomeIcon color="primary" sx={{ mr: 1.5 }} />,
    folder: <FolderOpenIcon color="primary" sx={{ mr: 1.5 }} />,
    allFolders: <PeopleIcon color="primary" sx={{ mr: 1.5 }} />,
  },
  breadcrumbsFolderIcons = {
    root: <HomeIcon fontSize="small" />,
    folder: <FolderIcon fontSize="small" />,
    allFolders: <ViewListIcon fontSize="small" />,
  },
  toolbarCustomIcons = {
    move: <FolderIcon />,
    unlink: <DeleteIcon />,
    clear: <CloseIcon fontSize="small" />,
  },
  moveDialogCustomIcons = {
    root: <HomeIcon fontSize="small" />,
    folder: <FolderIcon fontSize="small" />,
    current: <FolderSpecialIcon fontSize="small" />,
    breadcrumbSeparator: <NavigateNextIcon fontSize="small" />,
  },
  moveDialogSize = "sm",
  moveDialogTreeHeight = 350,
  maxFolderNameLength = 50,
  folderNameDialogError,
  folderNameDialogTitle,
  folderNameDialogConfirmButtonText,
  folderNameDialogCancelButtonText,
  renameFolderDialogError,
  renameFolderDialogTitle,
  renameFolderDialogConfirmButtonText,
  renameFolderDialogCancelButtonText,
  deleteFolderDialogTitle,
  deleteFolderDialogMessage,
  deleteFolderDialogConfirmButtonText,
  deleteFolderDialogCancelButtonText,
}) => {
  // Initialize hooks
  const { t } = useTranslate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { folders } = useFoldersStore()

  // Local state management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevFolderId, setPrevFolderId] = useState(selectedFolderId);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [moveFolderDialogOpen, setMoveFolderDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [itemToMove, setItemToMove] = useState(null);

  /**
   * Clear selection when folder changes
   */
  useEffect(() => {
    if (prevFolderId !== selectedFolderId) {
      setSelectedItems([]);
      setSelectionMode(false);
      setPrevFolderId(selectedFolderId);
    }
  }, [selectedFolderId, prevFolderId]);

  /**
   * Automatically manage selection mode based on selected items count
   */
  useEffect(() => {
    if (selectedItems.length > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (selectedItems.length === 0 && selectionMode) {
      setSelectionMode(false);
    }
  }, [selectedItems, selectionMode]);

  /**
   * Find folder object by ID from hierarchical folder structure
   *
   * @param {Array} folderList - List of folders to search through
   * @param {string} folderId - ID of folder to find
   * @returns {Object|null} - Found folder or null
   */
  const findFolder = (folderList, folderId) => {
    if (!folderList || !Array.isArray(folderList)) {
      console.error(t("explorer_invalid_folders_data"), folderList);
      return null;
    }

    for (const folder of folderList) {
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

  // Get current folder object
  const currentFolder = selectedFolderId
    ? findFolder(folders, selectedFolderId)
    : null;

  /**
   * Handle item selection toggle
   *
   * @param {string} itemId - ID of item to select/deselect
   * @param {boolean} isSelected - Whether item is selected
   */
  const handleSelectItem = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  /**
   * Handle select all/deselect all toggle
   */
  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      // Deselect all if all are selected
      setSelectedItems([]);
    } else {
      // Select all displayed items
      setSelectedItems(items.map((item) => item.id));
    }
  };

  /**
   * Clear all selections and exit selection mode
   */
  const handleClearSelection = () => {
    setSelectedItems([]);
    setSelectionMode(false);
  };

  /**
   * Open create folder dialog
   */
  const handleCreateFolder = () => {
    setIsNewFolderDialogOpen(true);
  };

  /**
   * Handle batch unlink operation for selected items
   */
  const handleBatchUnlink = () => {
    unlinkMultipleItems(selectedItems);
    setSelectedItems([]);
  };

  /**
   * Open move folder dialog
   */
  const handleMoveFolderOpen = () => {
    setMoveFolderDialogOpen(true);
  };

  /**
   * Close move folder dialog and reset selection
   */
  const handleMoveFolderClose = () => {
    setMoveFolderDialogOpen(false);
    setSelectedFolder("");
  };

  /**
   * Execute move operation for selected items or single item
   *
   * @param {string} folderId - Destination folder ID
   */
  const handleMoveToFolder = (folderId) => {
    if (itemToMove) {
      moveItemToFolder(itemToMove, folderId);
      setItemToMove(null);
    } else if (selectedItems.length > 0) {
      selectedItems.forEach((itemId) => {
        moveItemToFolder(itemId, folderId);
      });
      setSelectedItems([]);
    }
    setMoveFolderDialogOpen(false);
  };

  /**
   * Toggle mobile drawer open/closed
   */
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  /**
   * Open move dialog for a single item
   *
   * @param {string} itemId - ID of item to move
   */
  const handleOpenMoveDialog = (itemId) => {
    setItemToMove(itemId);
    setMoveFolderDialogOpen(true);
  };

  // Get move dialog title with proper translations based on selection count
  const moveDialogTitle = replacePlaceholders(
    t(`${itemLabels.translationKey}_move_to_folder`),
    {
      count: selectedItems.length,
      itemLabel:
        selectedItems.length === 1
          ? t(`${itemLabels.translationKey}_singular`)
          : t(`${itemLabels.translationKey}_plural`),
    }
  );

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Mobile drawer toggle button */}
          {isMobile && (
            <Button
              color="primary"
              variant="outlined"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </Button>
          )}

          {/* Breadcrumbs navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <FolderBreadcrumbs
                folders={folders}
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
                showAllFolders={showAllFolders}
                setShowAllFolders={setShowAllFolders}
                customIcons={breadcrumbsFolderIcons}
              />
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            position: "relative",
            width: "100%",
            marginBottom: 1,
          }}
        >
          {/* Folder sidebar - permanent on desktop, drawer on mobile */}
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={drawerOpen}
              onClose={toggleDrawer}
              ModalProps={{ keepMounted: true }}
              sx={{
                "& .MuiDrawer-paper": { width: 280, boxSizing: "border-box" },
              }}
            >
              <FolderSidebar
                folders={folders}
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
                showAllFolders={showAllFolders}
                setShowAllFolders={setShowAllFolders}
                rootFolderName={rootFolderName}
                collapsible={collapsibleSidebar}
                initialExpandedState={sidebarInitialExpandedState}
                onFolderSelect={(folderId) => {
                  if (onSidebarFolderSelect) {
                    onSidebarFolderSelect(folderId);
                  }
                  if (isMobile) {
                    toggleDrawer(); // Close drawer after selection on mobile
                  }
                }}
              />
            </Drawer>
          ) : (
            <Box sx={{ width: 240, flexShrink: 0, mr: 2 }}>
              <FolderSidebar
                folders={folders}
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
                showAllFolders={showAllFolders}
                setShowAllFolders={setShowAllFolders}
                rootFolderName={rootFolderName}
                collapsible={collapsibleSidebar}
                initialExpandedState={sidebarInitialExpandedState}
                onFolderSelect={onSidebarFolderSelect}
              />
            </Box>
          )}

          {/* Main content */}
          <Box
            sx={{
              flexGrow: 1,
              width: isMobile ? "100%" : "calc(100% - 260px)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
              {/* Main Content */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Folder Header with breadcrumbs and actions */}
                <FolderHeader
                  selectedFolder={currentFolder}
                  onRenameFolder={prepareRenameFolder}
                  onDeleteFolder={prepareDeleteFolder}
                  onCreateFolder={handleCreateFolder}
                  viewMode={viewMode}
                  onChangeViewMode={setViewMode}
                  onSelectAll={handleSelectAll}
                  showAllFolders={showAllFolders}
                  customIcons={headerCustomIcons}
                  itemLabels={itemLabels}
                />

                {/* Selection Toolbar - visible only when items are selected */}
                <ContentToolbar
                  selectedItems={selectedItems}
                  selectionMode={selectionMode}
                  onClearSelection={handleClearSelection}
                  onMoveToFolder={handleMoveFolderOpen}
                  onUnlink={handleBatchUnlink}
                  customIcons={toolbarCustomIcons}
                  itemLabels={itemLabels}
                />

                {/* Content List - displays items in grid or list view */}
                <ContentList
                  items={items}
                  viewMode={viewMode}
                  selectedItems={selectedItems}
                  selectionMode={selectionMode}
                  handleSelectItem={handleSelectItem}
                  handleUnlinkItem={handleUnlinkItem}
                  handleOpenMoveDialog={handleOpenMoveDialog}
                  folders={folders}
                  currentFolder={currentFolder}
                  filterValue={filterValue}
                  ItemCardComponent={ItemCardComponent}
                  ItemListComponent={ItemListComponent}
                  EmptyListComponent={EmptyListComponent}
                />
              </Box>

              {/* Dialogs */}
              {/* Move Folder Dialog */}
              <MoveFolderDialog
                open={moveFolderDialogOpen}
                onClose={handleMoveFolderClose}
                selectedFolder={selectedFolder}
                folders={folders}
                handleMoveToFolder={handleMoveToFolder}
                currentFolderId={
                  itemToMove
                    ? items.find((item) => item.id === itemToMove)?.folderId
                    : selectedItems.length > 0
                    ? items.find((item) => item.id === selectedItems[0])
                        ?.folderId
                    : null
                }
                title={moveDialogTitle}
                itemLabels={itemLabels}
                size={moveDialogSize}
                treeHeight={moveDialogTreeHeight}
                customIcons={moveDialogCustomIcons}
              />

              {/* Create New Folder Dialog */}
              <FolderNameDialogComponent
                open={isNewFolderDialogOpen}
                handleClose={() => {
                  setIsNewFolderDialogOpen(false);
                  setNewFolderName("");
                }}
                folderName={newFolderName}
                setFolderName={setNewFolderName}
                handleAction={() => createFolder(selectedFolderId)}
                mode="create"
                maxLength={maxFolderNameLength}
                folderNameError={folderNameDialogError}
                title={folderNameDialogTitle}
                confirmButtonText={folderNameDialogConfirmButtonText}
                cancelButtonText={folderNameDialogCancelButtonText}
              />

              {/* Rename Folder Dialog */}
              <FolderNameDialogComponent
                open={isRenameFolderDialogOpen}
                handleClose={() => {
                  setIsRenameFolderDialogOpen(false);
                  setFolderToRename(null);
                  setRenamedFolderName("");
                }}
                folderName={renamedFolderName}
                setFolderName={setRenamedFolderName}
                handleAction={() => confirmRenameFolder()}
                mode="rename"
                maxLength={maxFolderNameLength}
                folderNameError={renameFolderDialogError}
                title={renameFolderDialogTitle}
                confirmButtonText={renameFolderDialogConfirmButtonText}
                cancelButtonText={renameFolderDialogCancelButtonText}
              />

              {/* Delete Confirmation Dialog */}
              <DeleteFolderDialogComponent
                open={isDeleteFolderDialogOpen}
                handleClose={cancelDeleteFolder}
                handleConfirmDelete={() => confirmDeleteFolder()}
                title={deleteFolderDialogTitle}
                message={deleteFolderDialogMessage}
                confirmButtonText={deleteFolderDialogConfirmButtonText}
                cancelButtonText={deleteFolderDialogCancelButtonText}
              />
            </Box>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default Explorer;
