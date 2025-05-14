import React from "react";
import BrowserExplorer from '../../common/entityBrowser/BrowserExplorer.jsx';
import {useFoldersStore} from '../../stores/folderStore.js';
import NpcCard from "./NpcCard";
import NpcListItem from "./NpcListItem";
import { useNpcFiltersStore } from "./stores/npcFiltersStore";
import { useNpcStore } from "./stores/npcDataStore";

const NpcExplorer = ({ campaignNpcs, handleToggleNpc }) => {
  const { unlinkMultipleNpcs } = useNpcStore();
  const {
    selectedNpcFolderId,
    getDisplayedNpcs,
    setSelectedNpcFolderId,
    showAllFolders,
    setShowAllFolders,
  } = useNpcFiltersStore();

  const { moveNpcToFolder } = useFoldersStore();

  // Get displayed NPCs using the store's method
  const displayedNpcs = getDisplayedNpcs(campaignNpcs);

  const itemLabels = {
    singular: "NPC",
    plural: "NPCs",
    translationKey: "explorer_item_npc"
  };

  return (
    <BrowserExplorer
      items={displayedNpcs}
      itemCardComponent={NpcCard}
      itemListComponent={NpcListItem}
      handleUnlinkItems={handleToggleNpc}
      handleMoveItem={moveNpcToFolder}
      itemLabels={itemLabels}
      selectedFolderId={selectedNpcFolderId}
      setSelectedFolderId={setSelectedNpcFolderId}
      showAllFolders={showAllFolders}
      setShowAllFolders={setShowAllFolders}
      unlinkMultipleItems={unlinkMultipleNpcs}
    />
  );
};

export default NpcExplorer;
