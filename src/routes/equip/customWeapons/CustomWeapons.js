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

  // States for first form
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

  // States for second form
  const [hasTransforming, setHasTransforming] = useState(false);
  const [selectedCategory2, setSelectedCategory2] = useState(
    "weapon_category_arcane"
  );
  const [selectedRange2, setSelectedRange2] = useState("weapon_range_melee");
  const [selectedType2, setSelectedType2] = useState("physical");
  const [canSelectType2, setCanSelectType2] = useState(false);
  const [selectedCustomization2, setSelectedCustomization2] = useState(null);
  const [currentCustomizations2, setCurrentCustomizations2] = useState([
    {
      name: "weapon_customization_transforming",
      effect: "weapon_customization_transforming_effect",
      martial: false,
      customCost: 1,
    },
  ]);

  // Other states to implement
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

    // If transforming customization is added, enable transforming state
    if (customization.name === "weapon_customization_transforming") {
      setHasTransforming(true);
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

    // If transforming customization is removed, disable transforming state and reset all fields from second form
    if (customization.name === "weapon_customization_transforming") {
      resetSecondForm();
    }
  };

  const handleCustomizationAdd2 = () => {
    const customization = customizations.find(
      (custom) => custom.name === selectedCustomization2
    );

    if (!customization) return;

    // Prevent adding 'powerful' if the category is 'arcane' or 'dagger'
    if (
      customization.name === "weapon_customization_powerful" &&
      (selectedCategory2 === "weapon_category_arcane" ||
        selectedCategory2 === "weapon_category_dagger")
    ) {
      return; // Do nothing if invalid category
    }

    // Prevent adding 'quick' if 'powerful' is already selected
    if (
      customization.name === "weapon_customization_quick" &&
      currentCustomizations2.some(
        (c) => c.name === "weapon_customization_powerful"
      )
    ) {
      return; // Do nothing
    }

    // Prevent adding 'powerful' if 'quick' is already selected
    if (
      customization.name === "weapon_customization_powerful" &&
      currentCustomizations2.some(
        (c) => c.name === "weapon_customization_quick"
      )
    ) {
      return; // Do nothing
    }

    // If elemental customization is added, make type selection available
    if (customization.name === "weapon_customization_elemental") {
      setCanSelectType2(true);
    }

    // Check if adding the customization exceeds the allowed customization points
    if (
      currentCustomizations2.reduce((total, c) => total + c.customCost, 0) +
        customization.customCost >
      3
    ) {
      return; // Do nothing if cost exceeds limit
    }

    setCurrentCustomizations2([...currentCustomizations2, customization]);
    setSelectedCustomization2(null); // Reset selection
  };

  const handleCustomizationRemove2 = (customization) => {
    setCurrentCustomizations2((prev) =>
      prev.filter((item) => item.name !== customization.name)
    );
    // If elemental customization is removed, disable type selection
    if (customization.name === "weapon_customization_elemental") {
      setCanSelectType2(false);
      setSelectedType2("physical");
    }
  };

  const resetSecondForm = () => {
    setHasTransforming(false);
    setSelectedCategory2("weapon_category_arcane");
    setSelectedRange2("weapon_range_melee");
    setSelectedType2("physical");
    setCanSelectType2(false);
    setCurrentCustomizations2([
      {
        name: "weapon_customization_transforming",
        effect: "weapon_customization_transforming_effect",
        martial: false,
        customCost: 1,
      },
    ]);
    setSelectedCustomization2(null);
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
    resetSecondForm();
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
            {hasTransforming && (
              <Grid container item xs={12} spacing={1}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={4}>
                  <ChangeCategory
                    value={selectedCategory2}
                    onChange={(e) => setSelectedCategory2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ChangeRange
                    value={selectedRange2}
                    onChange={(e) => setSelectedRange2(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ChangeType
                    value={selectedType2}
                    onChange={(e) => setSelectedType2(e.target.value)}
                    disabled={!canSelectType2}
                  />
                </Grid>
                <ChangeCustomizations
                  selectedCustomization={selectedCustomization2}
                  setSelectedCustomization={setSelectedCustomization2}
                  onCustomizationAdd={handleCustomizationAdd2}
                  onCustomizationRemove={handleCustomizationRemove2}
                  currentCustomizations={currentCustomizations2}
                  selectedCategory={selectedCategory2}
                  isSecondForm={true}
                />
              </Grid>
            )}
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
