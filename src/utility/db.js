import { openDB } from "idb";

// Database name
const DB_NAME = "fultimatorDB";
// Database version
const DB_VERSION = 3;
// NPC object store name
export const NPC_STORE_NAME = "npcPersonal";
// PC object store name
export const PC_STORE_NAME = "pcPersonal";
// Encounter object store name
export const ENCOUNTER_STORE_NAME = "encounterStore";

// Campaign Manager store names
export const CAMPAIGN_STORE_NAME = "campaignStore";
export const SESSION_STORE_NAME = "sessionStore";
export const NOTE_STORE_NAME = "noteStore";
export const LOCATION_STORE_NAME = "locationStore";
export const NPC_CAMPAIGN_STORE_NAME = "npcCampaign";
export const NPC_FOLDER_STORE_NAME = "npcFolderStore";
export const FOLDER_STORE_NAME = "folderStore";

// Promise that resolves with the database instance
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  // Upgrade function for the database
  upgrade(db, oldVersion, newVersion) {
    console.log(`Upgrading DB from version ${oldVersion} to ${newVersion}`); // Log db upgrade

    // Handle existing stores
    if (oldVersion < 1) {
      if (!db.objectStoreNames.contains(NPC_STORE_NAME)) {
        db.createObjectStore(NPC_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(PC_STORE_NAME)) {
        db.createObjectStore(PC_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    }
    if (oldVersion < 2) {
      if (!db.objectStoreNames.contains(ENCOUNTER_STORE_NAME)) {
        db.createObjectStore(ENCOUNTER_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    }

    // Handle Campaign Manager stores - version 3
    if (oldVersion < 3) {
      if (!db.objectStoreNames.contains(CAMPAIGN_STORE_NAME)) {
        const campaignStore = db.createObjectStore(CAMPAIGN_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        campaignStore.createIndex("name", "name", { unique: false });
        campaignStore.createIndex("createdAt", "createdAt", { unique: false });
        campaignStore.createIndex("lastPlayedAt", "lastPlayedAt", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains(SESSION_STORE_NAME)) {
        const sessionStore = db.createObjectStore(SESSION_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        sessionStore.createIndex("campaignId", "campaignId", { unique: false });
        sessionStore.createIndex("sessionNumber", "sessionNumber", {
          unique: false,
        });
        sessionStore.createIndex("plannedDate", "plannedDate", {
          unique: false,
        });
        sessionStore.createIndex("status", "status", { unique: false });
      }

      if (!db.objectStoreNames.contains(NOTE_STORE_NAME)) {
        const noteStore = db.createObjectStore(NOTE_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        noteStore.createIndex("campaignId", "campaignId", { unique: false });
        noteStore.createIndex("title", "title", { unique: false });
        noteStore.createIndex("category", "category", { unique: false });
        noteStore.createIndex("parentNoteId", "parentNoteId", {
          unique: false,
        });
        noteStore.createIndex("createdAt", "createdAt", { unique: false });
        noteStore.createIndex("modifiedAt", "modifiedAt", { unique: false });
        noteStore.createIndex("folderId", "folderId", { unique: false });
        noteStore.createIndex("campaignIdFolderId", ["campaignId", "folderId"], { unique: false });
      }

      if (!db.objectStoreNames.contains(LOCATION_STORE_NAME)) {
        const locationStore = db.createObjectStore(LOCATION_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        locationStore.createIndex("campaignId", "campaignId", {
          unique: false,
        });
        locationStore.createIndex("name", "name", { unique: false });
        locationStore.createIndex("parentLocationId", "parentLocationId", {
          unique: false,
        });
        locationStore.createIndex("folderId", "folderId", { unique: false });
        locationStore.createIndex("campaignIdFolderId", ["campaignId", "folderId"], { unique: false });
      }
      if (!db.objectStoreNames.contains(NPC_FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(NPC_FOLDER_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        folderStore.createIndex("campaignId", "campaignId", { unique: false });
        folderStore.createIndex("name", "name", { unique: false });
        folderStore.createIndex("parentId", "parentId", { unique: false }); // Index parentId
        console.log("Created 'npcFolderStore' store.");
      }

      if (!db.objectStoreNames.contains(NPC_CAMPAIGN_STORE_NAME)) {
        const npcCampaignStore = db.createObjectStore(NPC_CAMPAIGN_STORE_NAME, {
          keyPath: ["npcId", "campaignId"], // Composite key
        });
        npcCampaignStore.createIndex("npcId", "npcId", { unique: false });
        npcCampaignStore.createIndex("campaignId", "campaignId", {
          unique: false,
        });
        npcCampaignStore.createIndex("attitude", "attitude", { unique: false });
        npcCampaignStore.createIndex("folderId", "folderId", { unique: false });
        console.log("Created 'npcCampaign' store.");
      }

      if (!db.objectStoreNames.contains(FOLDER_STORE_NAME)) {
        const folderStore = db.createObjectStore(FOLDER_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        folderStore.createIndex("campaignId", "campaignId", { unique: false });
        folderStore.createIndex("name", "name", { unique: false });
        folderStore.createIndex("parentId", "parentId", { unique: false }); // Index parentId
        console.log("Created 'folderStore' store.");
      }
    }
  },
});


export * from "./db/npc";
export * from "./db/pc";
export * from "./db/encounter";
export * from "./db/campaign";
export * from "./db/session";
export * from "./db/note";
export * from "./db/location";
export * from "./db/relationship";
export * from "./db/folder";
export * from "./db/npcFolder";
