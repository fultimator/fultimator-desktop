import React, { useState } from "react";
import ExplorerCard from '../../common/ExplorerCard.jsx';
import {NpcCardAttitudePicker} from './NpcCardAttitudePicker.jsx';
import NpcCardHeader from "./NpcCardHeader";
import NpcCardContent from "./NpcCardContent";
import NpcDetailDialog from "./NpcDetailDialog";
import { useNpcActions } from "./hooks/useNpcActions";
import { useNpcStore } from "./stores/npcDataStore";

const NpcCard = ({
  item,
  onUnlink,
  onNotes,
  onMove,
  onSelect,
  isSelected = false,
  selectionMode = false,
}) => {
  const { campaignId, loadNpcs, showSnackbar } = useNpcStore();
  const { handleEditNpc } = useNpcActions(
    campaignId,
    loadNpcs,
    showSnackbar
  );
  const isSimple = item.isSimplified;
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleDetailsOpen = () => {
    if (isSimple) return;
    setDetailsDialogOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
  };

  return (
  <React.Fragment>
    <ExplorerCard
      item={item}
      editText="Edit NPC"
      deleteText={isSimple ? 'Delete NPC' : 'Unlink NPC'}
      onUnlink={onUnlink}
      onEdit={handleEditNpc}
      onNotes={onNotes}
      onMove={onMove}
      onDetails={handleDetailsOpen}
      onSelect={onSelect}
      isSelected={isSelected}
      selectionMode={selectionMode}
      cardContent={(
        <>
          {/* Card Header with Image */}
          <NpcCardHeader imageUrl={item.imgurl} />

          {/* Card Content with NPC Details */}
          <NpcCardContent
            name={item.name}
            level={item.lvl}
            species={item.species}
            rank={item.rank}
            villain={item.villain}
            isSimple={isSimple}
          />
        </>
      )}
      additionalMenuItems={
        <NpcCardAttitudePicker item={item}/>
      }
    ></ExplorerCard>

      {/* NPC Details Dialog */}
      <NpcDetailDialog
        open={detailsDialogOpen}
        onClose={handleDetailsClose}
        npc={item}
      />
    </React.Fragment>
  );
};

export default NpcCard;
