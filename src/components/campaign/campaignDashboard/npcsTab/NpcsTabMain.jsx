import React, { useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {useParams} from 'react-router-dom';
import {useFoldersStore} from '../../stores/folderStore.js';
import NpcsTabHeader from "./NpcsTabHeader";
import SearchbarFilter from "./SearchbarFilter";
import LinkNpcDialog from "./LinkNpcDialog";
import SimpleNpcDialogEdit from "./SimpleNpcDialogEdit";
import EmptyNpcsList from "./EmptyNpcsList";
import NpcListLoading from "./NpcListLoading";
import NpcListError from "./NpcListError";
import FeedbackSnackbar from "./FeedbackSnackbar";
import useCampaignNpcs from "./hooks/useCampaignNpcs";
import { useNpcStore } from "./stores/npcDataStore";
import {useNpcDialogsStore} from "./stores/npcDialogsStore";
import NpcExplorer from "./NpcExplorer";

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
    setCampaignId: setFoldersCampaignId,
    setLoadNpcs,
    setShowSnackbar,
  } = useFoldersStore();

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

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid container spacing={1}>
        {/* Header */}
        <Grid item xs={12}>
          <NpcsTabHeader onCreateSimpleNpc={handleOpenSimpleNpcDialogEdit} onLinkNpc={handleAddExistingNpc} />
        </Grid>

        {/* Search, sort, and filter controls */}
        {campaignNpcs.length > 0 && (
          <Grid item xs={12}>
            <SearchbarFilter />
          </Grid>
        )}

        {/* Loading state */}
        {isLoading && (
          <Grid item xs={12}>
            <NpcListLoading />
          </Grid>
        )}

        {/* Error state */}
        {loadError && (
          <Grid item xs={12}>
            <NpcListError />
          </Grid>
        )}

        {/* Empty state */}
        {!isLoading && !loadError && campaignNpcs.length === 0 && (
          <Grid item xs={12}>
            <EmptyNpcsList handleAddExistingNpc={handleAddExistingNpc} />
          </Grid>
        )}

        {/* Display NPCs or Empty State for the current filter */}
        {!isLoading && !loadError && campaignNpcs.length > 0 && (
          <>
            <NpcExplorer
              campaignNpcs={campaignNpcs}
              handleToggleNpc={handleToggleNpc}
            />
          </>
        )}

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

        {/* Feedback snackbar */}
        <FeedbackSnackbar
          snackbar={snackbar}
          handleSnackbarClose={handleSnackbarClose}
        />
      </Grid>
    </Paper>
  );
};

export default NpcsTabMain;
