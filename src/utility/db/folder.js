import {
  dbPromise,
  FOLDER_STORE_NAME,
  NPC_CAMPAIGN_STORE_NAME
} from '../db';

// Adds a new folder to the database.
export const addFolder = async (folder) => {
  const db = await dbPromise;
  // Ensure campaignId is present
  if (!folder.campaignId) {
    throw new Error("campaignId is required to create an NPC folder.");
  }
  const folderToAdd = {
    campaignId: folder.campaignId.toString(),
    name: folder.name,
    parentId: folder.parentId || null,
    createdAt: new Date().toISOString(),
    items: [],
  };
  return db.add(FOLDER_STORE_NAME, folderToAdd);
};

// Retrieves all folders for a given campaign.
export const getFoldersForCampaign = async (campaignId) => {
  const db = await dbPromise;
  const tx = db.transaction(FOLDER_STORE_NAME, "readonly");
  const index = tx.store.index("campaignId");
  const folders = await index.getAll(campaignId.toString());

  // if (!folders?.length) {
  //   await db.add(FOLDER_STORE_NAME, {
  //     campaignId: campaignId.toString(),
  //     name: "Root",
  //     parentId: null,
  //     id: `root-${campaignId}`,
  //     createdAt: new Date().toISOString(),
  //   });
  // }

  // Function to build the folder hierarchy
  const buildFolderHierarchy = (parentId) => {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .map((folder) => ({
        ...folder,
        children: buildFolderHierarchy(folder.id),
      }));
  };

  // Get the root folders (folders with no parent)
  const rootFolders = buildFolderHierarchy(null);

  return rootFolders;
};

// Updates an existing folder in the database.
export const updateFolder = async (folder) => {
  const db = await dbPromise;
  const folderToUpdate = {
    id: folder.id,
    campaignId: folder.campaignId,
    name: folder.name,
    parentId: folder.parentId,
    modifiedAt: new Date().toISOString(),
  };
  await db.put(FOLDER_STORE_NAME, folderToUpdate);
};

// Deletes a folder from the database and moves its contents to the root folder.
export const deleteFolder = async (folderId, campaignId) => {
  try {
    const db = await dbPromise;
    // const tx = db.transaction([FOLDER_STORE_NAME], "readwrite");
    // const folderStore = tx.objectStore(FOLDER_STORE_NAME);
    await moveNpcsToRootFolder(folderId, campaignId);

    // Delete the folder
    await db.delete(FOLDER_STORE_NAME, folderId);

    // await tx.done;
    console.log(`Deleted folder ${folderId} and moved its contents to root.`);
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw new Error("Failed to delete folder: " + error.message);
  }
};

// Updates the folder of an entity in a campaign.
export const updateCampaignFolder = async (entityId, entityType, campaignId, folderId) => {
  if (entityType === 'npc') {
    await updateNpcCampaignFolder(entityId, campaignId, folderId);
  }
};

const moveNpcsToRootFolder = async (folderId, campaignId) => {
  try {
    const db = await dbPromise;
    const tx = db.transaction([NPC_CAMPAIGN_STORE_NAME], "readwrite");
    const npcCampaignStore = tx.objectStore(NPC_CAMPAIGN_STORE_NAME);
    const campaignIndex = npcCampaignStore.index("folderId");
    let cursor = await campaignIndex.openCursor(folderId);

    while (cursor) {
      const npcCampaign = cursor.value;
      // Only update if the NPC is also associated with the current campaign
      if (npcCampaign.campaignId === campaignId) {
        const updatedNpcCampaign = { ...npcCampaign, folderId: null };
        if (updatedNpcCampaign.folderId === undefined) {
          updatedNpcCampaign.folderId = null;
        }
        await cursor.update(updatedNpcCampaign);
      }
      cursor = await cursor.continue();
    }

    await tx.done;
    console.log(`Moved NPCs from ${folderId} to root.`);
  } catch (error) {
    console.error("Error moving NPCs from folder:", error);
    throw new Error("Failed to move NPC from folder: " + error.message);
  }
}

// Updates the folder of an NPC in a campaign.
const updateNpcCampaignFolder = async (npcId, campaignId, folderId) => {
  const db = await dbPromise;
  const npcCampaign = await db.get(NPC_CAMPAIGN_STORE_NAME, [npcId, campaignId]);

  if (npcCampaign) {
    const updatedNpcCampaign = { ...npcCampaign, folderId: folderId === undefined ? null : folderId };
    await db.put(NPC_CAMPAIGN_STORE_NAME, updatedNpcCampaign);
  } else {
    console.error("NPC campaign data not found for npcId:", npcId, "and campaignId:", campaignId);
    throw new Error("NPC campaign data not found");
  }
};

// // Adds an entity to a folder.
// export const addEntityToFolder = async (entity, campaignId, folderId) => {
//   const db = await dbPromise;
//   const folder = await db.get(FOLDER_STORE_NAME, folderId);
//   folder.items.push(entity);
//   await updateFolder(folder);
// };
//
// // Removes an entity from a folder.
// export const removeEntityFromFolder = async (entity, campaignId, folderId) => {
//   const db = await dbPromise;
//   const folder = await db.get(FOLDER_STORE_NAME, folderId);
//   folder.items = folder.items.filter(item => item.id !== entity.id);
//   await updateFolder(folder);
// };
