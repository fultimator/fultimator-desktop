import React, { useState, useEffect } from "react";
import {
  Grid,
  Accordion,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTranslate } from "../../../../translation/translate";
import { Edit, Error } from "@mui/icons-material";
import { Equip } from "../../../icons";
import PrettyAccessory from "./PrettyAccessory";
import Export from "../../../Export";
import CustomHeaderAccordion from "../../../common/CustomHeaderAccordion";
import { useCustomTheme } from "../../../../hooks/useCustomTheme";

export default function PlayerAccessories({
  player,
  accessories,
  onEditAccessory,
  onEquipAccessory,
  isEditMode,
}) {
  const { t } = useTranslate();
  const theme = useCustomTheme();

  const [expanded, setExpanded] = useState(false);

  const checkIfEquippable = (accessory) => {
    // if armor is not martial then is always equippable
    // true = equippable, false = not equippable

    const { classes } = player;

    // If the armor is not martial, it is always equippable
    if (!accessory.martial) {
      return true;
    }

    // Iterate through each class to check if the armor is equippable based on their benefits
    for (const playerClass of classes) {
      const { benefits } = playerClass;

      // Check if the class benefits allow equipping martial armor
      if (benefits.martials) {
        if (accessory.martial && benefits.martials.armor) {
          // The armor is equippable based on the current class
          return true;
        }
      }
    }

    // The armor is not equippable based on any of the player's classes
    return false;
  };

  const countEquippedAccessories = () => {
    let count = 0;
    accessories.forEach((accessory) => {
      if (accessory.isEquipped) {
        count++;
      }
    });
    return count;
  };

  const canEquipAccessory = () => {
    if (countEquippedAccessories() === 0) {
      return true;
    }
    return false;
  };

  const handleEquipAccessory = (index, checked) => {
    const accSelected = accessories[index];
    if (canEquipAccessory(accSelected) || !checked) {
      const updatedAcc = { ...accessories };
      updatedAcc[index].isEquipped = checked;
      onEquipAccessory(updatedAcc);
    } else {
      if (window.electron) {
        window.electron.alert(
          t("You cannot equip this accessory as you have already equipped one.")
        );
      } else {
        alert(
          "You cannot equip this accessory as you have already equipped one."
        );
      }
    }
  };

  useEffect(() => {
    // Open the Accordion when a new weapon is added
    if (accessories.length > 0) {
      setExpanded(true);
    }
  }, [accessories]);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      elevation={3}
      sx={{
        p: "15px",
        borderRadius: "8px",
        border: "2px solid",
        borderColor: theme.secondary,
        marginBottom: 3,
      }}
      expanded={expanded}
      onChange={handleAccordionChange}
    >
      <CustomHeaderAccordion
        expanded={expanded}
        handleAccordionChange={handleAccordionChange}
        headerText={t("Accessories")}
        showIconButton={false}
      />
      <AccordionDetails>
        <Grid container justifyContent="flex-end" spacing={2}>
          {/* map the weapons and display them with a PrettyWeapon component if they exist */}
          {accessories.map((accessory, index) => (
            <React.Fragment key={index}>
              <Grid item container xs={12} alignItems="center" spacing={1}>
                {/* Updated grid item */}
                <Grid item xs={11}>
                  <PrettyAccessory accessory={accessory} />
                </Grid>
                <Grid
                  item
                  container
                  xs={1}
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Updated grid item */}
                  {isEditMode && (
                    <Grid item xs={12}>
                      <IconButton onClick={() => onEditAccessory(index)}>
                        <Edit />
                      </IconButton>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    {checkIfEquippable(accessory) ? (
                      <Tooltip
                        title={
                          accessory.isEquipped
                            ? t("Unequip Accessory")
                            : t("Equip Accessory")
                        }
                      >
                        <IconButton
                          onClick={() =>
                            handleEquipAccessory(index, !accessory.isEquipped)
                          }
                          disabled={!isEditMode}
                          sx={{ mt: 1, boxShadow: "1px 1px 5px" }}
                        >
                          <Equip
                            color={accessory.isEquipped ? "green" : theme.ternary}
                            strokeColor={"#000"}
                          />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={t("Not Equippable")}>
                        <IconButton>
                          <Error color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Export name={accessory.name} dataType="accessory" data={accessory} />
                  </Grid>
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
