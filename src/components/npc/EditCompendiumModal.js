import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, List, ListItemButton, ListItemText, Typography, IconButton, Select, MenuItem, Divider, Box } from '@mui/material';
import { styled } from "@mui/system";
import { useTranslate } from "../../translation/translate";
import ReactMarkdown from 'react-markdown';
import { Close } from "@mui/icons-material";
import Diamond from "../Diamond";
import { OffensiveSpellIcon } from "../icons";
import { Martial } from "../icons";
import { npcSpells } from "../../libs/npcSpells";
import { npcAttacks } from "../../libs/npcAttacks";
import attributes from "../../libs/attributes";
import { CloseBracket, OpenBracket } from "../Bracket";

const EditCompendiumModal = ({ open, onClose, typeName, onSave }) => {
  const { t } = useTranslate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState(typeName || 'spells');

  const damageTypeLabels = {
    physical: "physical_damage",
    wind: "air_damage",
    bolt: "bolt_damage",
    dark: "dark_damage",
    earth: "earth_damage",
    fire: "fire_damage",
    ice: "ice_damage",
    light: "light_damage",
    poison: "poison_damage",
  };

  // Effect to set the correct type based on selectedType
  useEffect(() => {
    let newType = [];
    switch (selectedType) {
      case 'spells':
        newType = npcSpells;
        break;
      case 'attacks':
        newType = npcAttacks;
        break;
      default:
        newType = [];
        break;
    }
    setType(newType);
    setSelectedItem(newType.length > 0 ? newType[0] : null);
  }, [selectedType]);

  // Effect to set the default selectedType when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedType(typeName || 'spells');
    }
  }, [open, typeName]);

  const handleSave = () => {
    if (selectedItem) {
      onSave(selectedItem);
    }
    onClose();
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const StyledMarkdown = styled(ReactMarkdown)({
    whiteSpace: "pre-line",
    display: "inline",
  });

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "80%",
          maxWidth: "lg",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              fullWidth
              displayEmpty
              disabled
              inputProps={{ 'aria-label': 'Select type' }}
            >
              <MenuItem value="spells">{t("Spells")}</MenuItem>
              <MenuItem value="attacks">{t("Basic Attacks")}</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container>
          <Grid item xs={4} sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
            <List component="nav">
              {type.map((item, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleItemClick(item)}
                  selected={selectedItem === item}
                >
                  <ListItemText
                    primary={
                      <>
                        {item.name}
                        {item.type === "offensive" && <OffensiveSpellIcon />}
                        {item.martial === true && <Martial />}
                      </>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={8} sx={{ maxHeight: '40vh', overflowY: 'auto', px: 2 }}>
            {selectedItem && (
              <div>
                <Typography variant="h3">
                  {selectedItem.name} {selectedItem.type === "offensive" && <OffensiveSpellIcon />}
                </Typography>
                {(selectedType === 'attacks') && (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {t(selectedItem.category)}
                      <Box component="span" mx={1}><Diamond /></Box>
                      {selectedItem.hands === 1 ? t("One-handed") : t("Two-handed")}
                      <Box component="span" mx={1}><Diamond /></Box>
                      {selectedItem.melee ? t("Melee") : t("Ranged")}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      <strong>
                        <OpenBracket />
                        {selectedItem.attr1 && attributes[selectedItem.attr1]?.shortcaps}
                        {" + "}
                        {selectedItem.attr2 && attributes[selectedItem.attr2]?.shortcaps}
                        <CloseBracket />
                      </strong>
                      <Box component="span" mx={1}><Diamond /></Box>
                      <strong>
                        <OpenBracket />
                        {t("HR")} + {5 + selectedItem.flatdmg}
                        <CloseBracket />
                      </strong>{" "}
                      <span>
                        <ReactMarkdown
                          allowedElements={["strong"]}
                          unwrapDisallowed={true}
                        >
                          {t(damageTypeLabels[selectedItem.type])}
                        </ReactMarkdown>
                      </span>
                    </Typography>
                    <Typography variant="body2">{selectedItem.specials}</Typography>
                  </>
                )}
                {(selectedType === 'spells') && (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {selectedItem.mp} {selectedItem.maxTargets !== 1 ? " × " + t("T") : ""} {t("MP")}
                      <Box component="span" mx={1}><Diamond /></Box>
                      <StyledMarkdown allowedElements={["strong"]} unwrapDisallowed={true}>
                        {selectedItem.target}
                      </StyledMarkdown>
                      <Box component="span" mx={1}><Diamond /></Box>
                      <StyledMarkdown allowedElements={["strong"]} unwrapDisallowed={true}>
                        {selectedItem.duration}
                      </StyledMarkdown>
                    </Typography>
                    <StyledMarkdown allowedElements={["strong"]} unwrapDisallowed={true}>
                      {selectedItem.effect}
                    </StyledMarkdown>
                  </>
                )}
              </div>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm="auto">
            <Typography variant="body2">
              <strong>Disclaimer:</strong> For personal use only; do not share exported data on official channels.
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto" container justifyContent="flex-end">
            <Button disabled variant="contained" color="secondary" sx={{ mr: 1 }}>
              {t("Export JSON")}
            </Button>
            <Button disabled variant="contained" color="secondary" sx={{ mr: 1 }}>
              {t("Import JSON")}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              {t("Add Item")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default EditCompendiumModal;
