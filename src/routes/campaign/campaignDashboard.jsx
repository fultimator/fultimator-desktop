import React, { useState, useEffect } from "react";
import {useParams, useNavigate, Routes, Route, useLocation} from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {usePCStore} from '../../components/campaign/campaignDashboard/charactersTab/stores/characterStore.js';
import {useLocationStore} from '../../components/campaign/campaignDashboard/locationsTab/stores/locationStore.js';
import {useNoteStore} from '../../components/campaign/campaignDashboard/notesTab/stores/noteStore.js';
import {useNpcStore} from '../../components/campaign/campaignDashboard/npcsTab/stores/npcDataStore.js';
import {useSessionStore} from '../../components/campaign/campaignDashboard/sessionsTab/stores/sessionsStore.js';
import {useCampaignStore} from '../../components/campaign/stores/campaignStore.js';
import {useFoldersStore} from '../../components/campaign/stores/folderStore.js';
import Layout from "../../components/Layout";
import LoadingPage from "../../components/common/LoadingPage";
import OverviewTab from "../../components/campaign/campaignDashboard/OverviewTab";
import SessionsTab from "../../components/campaign/campaignDashboard/SessionsTab";
import CharactersTab from "../../components/campaign/campaignDashboard/CharactersTab";
import NpcsTab from "../../components/campaign/campaignDashboard/NpcsTab";
import NotesTab from "../../components/campaign/campaignDashboard/NotesTab";
import LocationsTab from "../../components/campaign/campaignDashboard/LocationsTab";
import MapTab from "../../components/campaign/campaignDashboard/MapTab";
import TabsNavigation from "../../components/campaign/campaignDashboard/TabsNavigation";
import { WorldIcon } from "../../components/icons";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { ArrowDropUp as ArrowDropUpIcon } from "@mui/icons-material";
import CampaignDialog from "../../components/campaign/campaignList/CampaignDialog"; // Import CampaignDialog

const DEFAULT_CAMPAIGN_IMAGE = "/images/default-campaign.jpg"; // Add default image constant

// Component for the campaign dashboard
const CampaignDashboard = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  // Add edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const locationStore = useLocationStore();
  const pcsStore = usePCStore();
  const npcStore = useNpcStore();
  const noteStore = useNoteStore();
  const sessionStore = useSessionStore();
  const campaignStore = useCampaignStore();
  const folderStore = useFoldersStore();
  const campaign = campaignStore.campaign;

  // Fetch campaign data
  useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setLoading(true);

        // Fetch campaign details
        campaignStore.setCampaignId(+campaignId);
        await campaignStore.loadCampaign()
        if (!campaign) {
          setError("Campaign not found");
          setLoading(false);
          return;
        }

        locationStore.setCampaignId(+campaignId);
        pcsStore.setCampaignId(+campaignId);
        npcStore.setCampaignId(+campaignId);
        noteStore.setCampaignId(+campaignId);
        sessionStore.setCampaignId(+campaignId);
        folderStore.setCampaignId(+campaignId);
        await folderStore.fetchFolders();


        // Update last played timestamp
        await campaignStore.updateLastPlayed();

        // Fetch related data
        await Promise.all([
          sessionStore.loadSessions(),
          locationStore.loadLocations(),
          noteStore.loadNotes(),
          pcsStore.loadCharacters(),
          npcStore.loadNpcs(),
        ]);
      } catch (error) {
        console.error("Error loading campaign data:", error);
        setError("Failed to load campaign data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCampaignData();
  }, [campaignId]);

  useEffect(() => {
    const tabs = ['overview', 'sessions', 'characters', 'npcs', 'notes', 'locations', 'map'];
    tabs.forEach((tab) => {
      if (location.pathname.includes(tab)) {
        setActiveTab(tab);
      }
    })
  }, [location])

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    navigate(`/campaign/${campaignId}/${newValue}`, { replace: true });
  };

  // Navigate back to campaign list
  const handleBackToCampaigns = () => {
    navigate("/campaigns");
  };

  // Navigate to campaign edit - UPDATE THIS
  const handleEditCampaign = () => {
    // Set the campaign to be edited and open the dialog
    const campaignToEdit = { ...campaignStore.campaign };
    // Clear the imageUrl if it's the default image
    if (campaignToEdit.imageUrl === '/images/default-campaign.jpg') {
      campaignToEdit.imageUrl = '';
    }
    setEditingCampaign(campaignToEdit);
    setEditDialogOpen(true);
  };

  // Add new handlers for the edit dialog
  const handleEditDialogClose = () => {
    if (!actionInProgress) {
      setEditDialogOpen(false);
      setEditingCampaign(null); // Clear the editing campaign data
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingCampaign((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditImageUpdate = (newImageUrl) => {
    setEditingCampaign((prev) => ({
      ...prev,
      imageUrl: newImageUrl || DEFAULT_CAMPAIGN_IMAGE, // Use default if empty
    }));
  };

  const handleEditTagInput = (event) => {
    const { value } = event.target;
    // Convert comma-separated string to array, trimming whitespace
    const tagsArray = value.split(",").map((tag) => tag.trim()).filter(tag => tag);
    setEditingCampaign((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  const handleUpdateCampaign = async () => {
    if (!editingCampaign || !campaignId) return;

    setActionInProgress(true);
    try {
      await campaignStore.updateCampaign(editingCampaign);
    } catch (err) {
      console.error("Error updating campaign:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !campaign) {
    return (
      <Layout>
        <Container sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || "Campaign not found"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToCampaigns}
            sx={{ borderRadius: 2 }}
          >
            Back to Campaigns
          </Button>
        </Container>
      </Layout>
    );
  }

  // Render the dashboard
  return (
    <Layout fullWidth>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            mb: 3,
            borderRadius: 2,
            overflow: "hidden",
            background: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(to right, ${primary}, ${primary}, ${secondary})`,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={{ px: 0.5, color: "#ffffff", cursor: "default" }}>
                <WorldIcon color="#ffffff" />
              </IconButton>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "#ffffff",
                  flex: 1,
                  textTransform: "uppercase",
                  ml: 1,
                }}
              >
                {campaign.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {campaign.description && (
                <IconButton
                  onClick={() => setShowDescription((prev) => !prev)}
                  sx={{
                    color: "#ffffff",
                    mr: 1,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  title={
                    showDescription ? "Hide description" : "Show description"
                  }
                >
                  {showDescription ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </IconButton>
              )}
              <IconButton
                onClick={handleEditCampaign}
                sx={{
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>

          {campaign.description && (
            <Box
              sx={{
                maxHeight: showDescription ? "500px" : "0px",
                opacity: showDescription ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.35s ease-out, opacity 0.35s ease-out",
                borderTop: showDescription
                  ? `1px solid ${theme.palette.divider}`
                  : "none",
                background: theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  transform: showDescription
                    ? "translateY(0)"
                    : "translateY(-10px)",
                  transition: "transform 0.35s ease-out",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {campaign.description}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
        {/* Campaign Dashboard Tabs */}
        <TabsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <Routes>
          { ['/', '/overview'].map((path) =>
            <Route key={path} path={path} element={
              <OverviewTab/>
            } />
          )}

          <Route path="/sessions" element={
            <SessionsTab />
          } />
          <Route path="/characters" element={
            <CharactersTab />
          } />
          <Route path="/npcs" element={
            <NpcsTab />
          } />
          <Route path="/notes" element={
            <NotesTab />
          } />
          <Route path="/locations/*" element={
            <LocationsTab />
          } />
          <Route path="/map" element={
            <MapTab />
          } />
        </Routes>
      </Container>

      {/* Render CampaignDialog for editing */}
      {editingCampaign && ( // Conditionally render based on editingCampaign
        <CampaignDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onUpdate={handleUpdateCampaign}
          campaign={editingCampaign}
          onInputChange={handleEditInputChange}
          onImageUpdate={handleEditImageUpdate}
          onTagInput={handleEditTagInput}
          isEditMode={true}
          actionInProgress={actionInProgress}
        />
      )}
    </Layout>
  );
};

export default CampaignDashboard;
