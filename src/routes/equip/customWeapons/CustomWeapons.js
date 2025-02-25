import { Grid, Paper, Button, useTheme, Divider } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { useState, useRef } from "react";
import ChangeCategory from "./ChangeCategory";
import ChangeRange from "./ChangeRange";
import ChangeAccuracyCheck from "./ChangeAccuracyCheck";
import ChangeCustomizations from "./ChangeCustomizations";
import ChangeType from "./ChangeType";
import { customizations } from "./libs.js";
import { useTranslate } from "../../../translation/translate";
import CustomHeaderAlt from "../../../components/common/CustomHeaderAlt";

function CustomWeapons() {
  const { t } = useTranslate();
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  const [selectedCategory, setSelectedCategory] = useState(
    "weapon_category_arcane"
  );
  const [selectedRange, setSelectedRange] = useState("weapon_range_melee");
  const [selectedAccuracyCheck, setSelectedAccuracyCheck] = useState({
    att1: "dexterity",
    att2: "insight",
  });
  const [selectedCustomization, setSelectedCustomization] = useState(null);
  const [currentCustomizations, setCurrentCustomizations] = useState([]);
  const [selectedType, setSelectedType] = useState("physical");
  const [canSelectType, setCanSelectType] = useState(false);

  const [martial, setMartial] = useState(false);
  const [damageBonus, setDamageBonus] = useState(false);
  const [damageReworkBonus, setDamageReworkBonus] = useState(false);
  const [precBonus, setPrecBonus] = useState(false);
  const [rework, setRework] = useState(false);
  const [quality, setQuality] = useState("");
  const [qualityCost, setQualityCost] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState("");

  const fileInputRef = useRef(null);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;

    // Remove 'powerful' customization if the category is 'arcane' or 'dagger'
    if (
      newCategory === "weapon_category_arcane" ||
      newCategory === "weapon_category_dagger"
    ) {
      setCurrentCustomizations((prev) =>
        prev.filter(
          (customization) =>
            customization.name !== "weapon_customization_powerful"
        )
      );
      console.log("Powerful removed as category is 'arcane' or 'dagger'");
    }

    setSelectedCategory(newCategory);
  };

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const handleAccuracyCheckChange = (newValue) => {
    setSelectedAccuracyCheck(newValue);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleCustomizationAdd = () => {
    const customization = customizations.find(
      (custom) => custom.name === selectedCustomization
    );

    if (!customization) return;

    // Prevent adding 'powerful' if the category is 'arcane' or 'dagger'
    if (
      customization.name === "weapon_customization_powerful" &&
      (selectedCategory === "weapon_category_arcane" ||
        selectedCategory === "weapon_category_dagger")
    ) {
      return; // Do nothing if invalid category
    }

    // Prevent adding 'quick' if 'powerful' is already selected
    if (
      customization.name === "weapon_customization_quick" &&
      currentCustomizations.some(
        (c) => c.name === "weapon_customization_powerful"
      )
    ) {
      return; // Do nothing
    }

    // Prevent adding 'powerful' if 'quick' is already selected
    if (
      customization.name === "weapon_customization_powerful" &&
      currentCustomizations.some((c) => c.name === "weapon_customization_quick")
    ) {
      return; // Do nothing
    }

    // If elemental customization is added, make type selection available
    if (customization.name === "weapon_customization_elemental") {
      setCanSelectType(true);
    }

    // Check if adding the customization exceeds the allowed customization points
    if (
      currentCustomizations.reduce((total, c) => total + c.customCost, 0) +
        customization.customCost >
      3
    ) {
      return; // Do nothing if cost exceeds limit
    }

    setCurrentCustomizations([...currentCustomizations, customization]);
    setSelectedCustomization(null); // Reset selection
  };

  const handleCustomizationRemove = (customization) => {
    setCurrentCustomizations((prev) =>
      prev.filter((item) => item.name !== customization.name)
    );
    // If elemental customization is removed, disable type selection
    if (customization.name === "weapon_customization_elemental") {
      setCanSelectType(false);
      setSelectedType("physical");
    }
  };

  const handleClearFields = () => {
    setDamageBonus(false);
    setDamageReworkBonus(false);
    setPrecBonus(false);
    setRework(false);
    setQuality("");
    setQualityCost(0);
    setSelectedQuality("");
    setSelectedCategory("weapon_category_arcane");
    setSelectedRange("weapon_range_melee");
    setSelectedAccuracyCheck({ att1: "dexterity", att2: "insight" });
    setCurrentCustomizations([]);
    setSelectedCustomization(null);
    setSelectedType("physical");
    setCanSelectType(false);
  };

  return (
    <Grid container spacing={2}>
      {/* Form */}
      <Grid item xs={12} sm={6}>
        <Paper
          elevation={3}
          sx={{
            p: "14px",
            borderRadius: "8px",
            border: "2px solid",
            borderColor: secondary,
          }}
        >
          {/* Header */}
          <CustomHeaderAlt
            headerText={t("weapons_custom_title")}
            icon={<AutoAwesome fontSize="large" />}
          />

          <Grid container spacing={1} alignItems="center">
            {/* Change Category */}
            <Grid item xs={4}>
              <ChangeCategory
                value={selectedCategory}
                onChange={handleCategoryChange}
              />
            </Grid>
            {/* Change Range */}
            <Grid item xs={4}>
              <ChangeRange value={selectedRange} onChange={handleRangeChange} />
            </Grid>
            {/* Change Accuracy Check */}
            <Grid item xs={4}>
              <ChangeAccuracyCheck
                value={selectedAccuracyCheck}
                onChange={handleAccuracyCheckChange}
              />
            </Grid>
            {/* Change Customizations */}
            <ChangeCustomizations
              selectedCustomization={selectedCustomization}
              setSelectedCustomization={setSelectedCustomization}
              onCustomizationAdd={handleCustomizationAdd}
              onCustomizationRemove={handleCustomizationRemove}
              currentCustomizations={currentCustomizations}
              selectedCategory={selectedCategory}
            />

            {/* Change Type */}
            <Grid item xs={12}>
              <ChangeType
                value={selectedType}
                onChange={handleTypeChange}
                disabled={!canSelectType}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {t("Upload JSON")}
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={handleClearFields}>
                    {t("Clear All Fields")}
                  </Button>
                </Grid>
              </Grid>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      try {
                        const result = JSON.parse(reader.result);
                        console.log(result); // Handle JSON data
                      } catch (error) {
                        console.error("Invalid JSON file", error);
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Additional UI Components */}
      <Grid item xs={12} sm={6}>
        {/* Future content can go here */}
      </Grid>
    </Grid>
  );
}

export default CustomWeapons;
