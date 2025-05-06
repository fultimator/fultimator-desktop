import {Add as AddIcon, Link as LinkIcon} from '@mui/icons-material';
import React, { useEffect } from "react";
import {Button} from '@mui/material';
import {useParams} from 'react-router-dom';
import BrowserMain from '../../common/entityBrowser/BrowserMain.jsx';
import EntityListError from '../../common/entityBrowser/EntityListError.jsx';
import {useFoldersStore} from '../../stores/folderStore.js';
import NPCsSearchFilters from "./NPCsSearchFilters.jsx";
import LinkNpcDialog from "./LinkNpcDialog";
import SimpleNpcDialogEdit from "./SimpleNpcDialogEdit";
import useCampaignNpcs from "./hooks/useCampaignNpcs";
import { useNpcStore } from "./stores/npcDataStore";
import {useNpcDialogsStore} from "./stores/npcDialogsStore";
import NpcExplorer from "./NpcExplorer";
import {useNpcFiltersStore} from './stores/npcFiltersStore.js';

const NpcsTabMain = () => {
  const {campaignId} = useParams();

  const {
    // State & Derived Values
    filteredNpcsForDialog
  } = useCampaignNpcs(campaignId);

  const {
    initialize: initializeNpcs,
    campaignNpcs,
    isLoading,
    loadError,
    snackbar,
    showSnackbar,
    handleSnackbarClose,
    associatedNpcIds,
    toggleNpc: handleToggleNpc,
    handleCreateSimpleNpc,
  } = useNpcStore();

  const {
    loadNpcs,
    setCampaignId: setFoldersCampaignId,
    setLoadNpcs,
    setShowSnackbar,
  } = useFoldersStore();

  const {
    filterSearchText,
    setNpcSortOrder,
    setNpcAttitudeFilter,
    setShowVillainsOnly,
    setNpcRank,
    setNpcSpecies,
    setFilterSearchText,
    setNpcSortDirection,
  } = useNpcFiltersStore();

  const {
    // Dialog states
    isLinkNpcDialogOpen,
    linkNpcSearchText,
    isSimpleNpcDialogEditOpen,
    simpleNpcItem,
    // Actions
    handleAddExistingNpc,
    handleCloseLinkDialog,
    setLinkNpcSearchText,
    handleOpenSimpleNpcDialogEdit,
    handleCloseSimpleNpcDialogEdit,
  } = useNpcDialogsStore();

  useEffect(() => {
    initializeNpcs(campaignId);
    setFoldersCampaignId(campaignId);
    setLoadNpcs(() => initializeNpcs(campaignId));
    setShowSnackbar(showSnackbar);
  }, [
    campaignId,
    setFoldersCampaignId,
    setLoadNpcs,
    showSnackbar,
    setShowSnackbar,
    initializeNpcs
  ]);

  const clearAllFilters = () => {
    setFilterSearchText("");
    setNpcSortOrder("name");
    setNpcSortDirection("asc");
    setNpcAttitudeFilter("all");
    setShowVillainsOnly(false);
    setNpcRank("");
    setNpcSpecies("");
  };

  return (
    <>
      <BrowserMain
        headerTitle="Campaign NPCs"
        headerActions={
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenSimpleNpcDialogEdit}
              sx={{ mr: 1 }}
            >
              Add Simplified NPC
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              onClick={handleAddExistingNpc}
              sx={{ mr: 1 }}
            >
              Link NPC
            </Button>
          </>
        }
        emptyListAction={handleAddExistingNpc}
        listErrorRetry={loadNpcs}
        loadError={loadError}
        isLoading={isLoading}
        items={campaignNpcs}
        snackbar={snackbar}
        handleSnackbarClose={handleSnackbarClose}
        listErrorComponent={
          <EntityListError
            onRetry={loadNpcs}
            errorMessage={loadError}
          />
        }
        explorerComponent={
          <NpcExplorer
            campaignNpcs={campaignNpcs}
            handleToggleNpc={handleToggleNpc}
          />
        }
        searchText={filterSearchText}
        handleSearchTextUpdate={setFilterSearchText}
        handleFiltersClearAll={clearAllFilters}
        searchFiltersComponent={<NPCsSearchFilters />}
      ></BrowserMain>


      {/* Link NPC Dialog */}
      <LinkNpcDialog
        open={isLinkNpcDialogOpen}
        handleClose={handleCloseLinkDialog}
        searchText={linkNpcSearchText}
        setSearchText={setLinkNpcSearchText}
        filteredNpcs={filteredNpcsForDialog}
        associatedNpcIds={associatedNpcIds}
        handleToggleNpc={handleToggleNpc}
      />
      <SimpleNpcDialogEdit
        open={isSimpleNpcDialogEditOpen}
        onClose={handleCloseSimpleNpcDialogEdit}
        onSubmit={handleCreateSimpleNpc}
        initialNpc={simpleNpcItem}
      />
    </>
  );
};

export default NpcsTabMain;
