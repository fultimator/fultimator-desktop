import { create } from "zustand";
import {
  getRelatedNpcs,
  getNpcs,
  associateNpcWithCampaign,
  disassociateNpcFromCampaign,
  addCampaignNpc,
  deleteCampaignNpc,
} from "../../../../../utility/db";
import { t, replacePlaceholders } from "../../../../../translation/translate";

export const useNpcStore = create((set, get) => ({
  // Data
  allNpcs: [],
  associatedNpcIds: [],
  campaignNpcs: [],
  npcFolders: [],
  campaignId: null,

  // Loading state
  isLoading: false,
  loadError: null,

  // Snackbar state
  snackbar: {
    open: false,
    message: "",
    severity: "success",
  },

  // Setters
  setCampaignId: (id) => set({ campaignId: id }),
  setAllNpcs: (npcs) => set({ allNpcs: npcs }),
  setAssociatedNpcIds: (ids) => set({ associatedNpcIds: ids }),
  setCampaignNpcs: (npcs) => set({ campaignNpcs: npcs }),
  setNpcFolders: (folders) => set({ npcFolders: folders }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setLoadError: (error) => set({ loadError: error }),

  // Snackbar actions
  showSnackbar: (message, severity) =>
    set({
      snackbar: {
        open: true,
        message,
        severity,
      },
    }),

  handleSnackbarClose: () =>
    set((state) => ({
      snackbar: { ...state.snackbar, open: false },
    })),

  // Core actions
  loadNpcs: async () => {
    const { campaignId } = get();

    set({ isLoading: true, loadError: null });

    try {
      // Load NPCs associated with campaign
      const relatedNpcs = await getRelatedNpcs(campaignId);
      set({
        associatedNpcIds: relatedNpcs.map((npc) => npc.id),
        campaignNpcs: relatedNpcs,
      });

      // Load all NPCs
      const allNpcsList = await getNpcs();
      set({ allNpcs: allNpcsList });

      return {
        campaignNpcs: relatedNpcs,
        allNpcs: allNpcsList,
        npcFolders: get().npcFolders,
      };
    } catch (err) {
      console.error("Error loading NPCs:", err);
      set({ loadError: t("npcs_load_error") });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleNpc: async (npcId) => {
    const {
      campaignId,
      associatedNpcIds,
      allNpcs,
      campaignNpcs,
      showSnackbar,
    } = get();

    try {
      const npc = campaignNpcs.find((npc) => npc.id === npcId);

      if (associatedNpcIds.includes(npcId)) {
        await disassociateNpcFromCampaign(npcId, campaignId);

        // If NPC is simplified, delete it entirely
        if (npc?.isSimplified) {
          await deleteCampaignNpc(npcId);
        }

        set({
          associatedNpcIds: associatedNpcIds.filter((id) => id !== npcId),
          campaignNpcs: campaignNpcs.filter((npc) => npc.id !== npcId),
        });

        showSnackbar(t("npc_remove_success"), "info");
        return true;
      } else {
        // Add NPC to campaign
        await associateNpcWithCampaign(npcId, campaignId);

        const npcToAdd = allNpcs.find((n) => n.id === npcId);
        if (npcToAdd) {
          set({
            associatedNpcIds: [...associatedNpcIds, npcId],
            campaignNpcs: [...campaignNpcs, npcToAdd],
          });

          showSnackbar(t("npc_add_success"), "success");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error toggling NPC association:", error);
      showSnackbar(t("npc_association_update_error"), "error");
      return false;
    }
  },

  unlinkMultipleNpcs: async (npcIds = []) => {
    const { campaignId, associatedNpcIds, campaignNpcs, showSnackbar } = get();

    if (!npcIds.length) return;

    try {
      // Use Promise.all to remove all NPCs in parallel
      await Promise.all(
        npcIds.map((npcId) => disassociateNpcFromCampaign(npcId, campaignId))
      );

      // Filter out the removed NPCs from state
      const updatedNpcIds = associatedNpcIds.filter(
        (id) => !npcIds.includes(id)
      );
      const updatedCampaignNpcs = campaignNpcs.filter(
        (npc) => !npcIds.includes(npc.id)
      );

      set({
        associatedNpcIds: updatedNpcIds,
        campaignNpcs: updatedCampaignNpcs,
      });

      showSnackbar(
        replacePlaceholders(t("npc_remove_multiple_success"), {
          count: npcIds.length,
        }),
        "info"
      );
    } catch (error) {
      console.error("Error unlinking multiple NPCs:", error);
      showSnackbar(t("npc_remove_error"), "error");
    }
  },

  handleCreateSimpleNpc: async (npc) => {
    const { campaignId, showSnackbar, loadNpcs } = get();
    try {
      const newNpcId = await addCampaignNpc(npc, campaignId);
      showSnackbar(t("npc_create_success"), "success");
      return newNpcId;
    } catch (error) {
      console.error("Error creating simple NPC:", error);
      showSnackbar(t("npc_create_error"), "error");
      return null;
    } finally {
      loadNpcs();
    }
  },

  // Initialize - can be called in useEffect when component mounts
  initialize: async (campaignId) => {
    set({ campaignId });
    return get().loadNpcs();
  },
}));
