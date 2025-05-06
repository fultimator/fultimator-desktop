import React from "react";
import {Grid, Paper} from '@mui/material';
import EmptyEntityList from './EmptyEntityList.jsx';
import EntityListError from './EntityListError.jsx';
import EntityListLoading from './EntityListLoading.jsx';
import BrowserTabHeader from './BrowserTabHeader.jsx';
import SearchbarFilter from "./SearchbarFilter.jsx";
import FeedbackSnackbar from "./FeedbackSnackbar";

const BrowserMain = ({headerTitle, entityType, headerActions, loadError, listErrorRetry, emptyListAction, isLoading, items, explorerComponent, snackbar, handleSnackbarClose, searchFiltersComponent, searchText, handleSearchTextUpdate, handleFiltersClearAll }) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid container spacing={1}>
        {/* Header */}
        <Grid item xs={12}>
          <BrowserTabHeader
            title={headerTitle}
            actions={headerActions}
          ></BrowserTabHeader>
        </Grid>

        {/* Search, sort, and filter controls */}
        {items.length > 0 && (
          <Grid item xs={12}>
            <SearchbarFilter
              filtersComponent={searchFiltersComponent}
              searchText={searchText}
              handleSearchTextUpdate={handleSearchTextUpdate}
              handleClear={handleFiltersClearAll}
            />
          </Grid>
        )}

        {/* Loading state */}
        {isLoading && (
          <Grid item xs={12}>
            <EntityListLoading type={entityType} />
          </Grid>
        )}

        {/* Error state */}
        {loadError && (
          <Grid item xs={12}>
            <EntityListError loadError={loadError} retry={listErrorRetry} />
          </Grid>
        )}

        {/* Empty state */}
        {!isLoading && !loadError && items.length === 0 && (
          <Grid item xs={12}>
            <EmptyEntityList handleAdd={emptyListAction} type={'NPC'}></EmptyEntityList>
          </Grid>
        )}

        {/* Display NPCs or Empty State for the current filter */}
        {!isLoading && !loadError && items.length > 0 && (
          explorerComponent
        )}

        {/* Feedback snackbar */}
        <FeedbackSnackbar
          snackbar={snackbar}
          handleSnackbarClose={handleSnackbarClose}
        />
      </Grid>
    </Paper>
  );
};

export default BrowserMain;
