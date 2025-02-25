import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  InputLabel,
  Input,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  Button,
  useTheme,
  ThemeProvider,
} from "@mui/material";
import { AutoAwesome, Spa } from '@mui/icons-material'
import { RestartAltOutlined } from "@mui/icons-material";
import { useState, useMemo, useEffect } from "react";
import Layout from "../../components/Layout";
import Weapons from "../equip/weapons/Weapons";
import ArmorShield from "../equip/ArmorShield/ArmorShield";
import Accessories from "../equip/Accessories/Accessories";
import randomQualities from "./randomqualities.json";
import Arcana from "../equip/Arcana/Arcana";
import { useTranslate } from "../../translation/translate";
import CustomHeaderAlt from '../../components/common/CustomHeaderAlt';
import CopyToClipboard from '../../components/common/CopyToClipboard';
import { useCustomTheme } from "../../hooks/useCustomTheme";
import CustomWeapons from "../equip/customWeapons/CustomWeapons";

const powerPMs = {
  minor: 20,
  medium: 30,
  major: 40,
  extreme: 50,
};

const powerLDs = {
  minor: 7,
  medium: 10,
  major: 13,
  extreme: 16,
};

const powerClocks = {
  minor: 4,
  medium: 6,
  major: 6,
  extreme: 8,
};

const powerCosts = {
  minor: 100,
  medium: 200,
  major: 400,
  extreme: 800,
};

const areaPMs = {
  individual: 1,
  small: 2,
  large: 3,
  huge: 4,
};

const areaCosts = {
  individual: 1,
  small: 2,
  large: 3,
  huge: 4,
};

const usesCosts = {
  consumable: 1,
  permanent: 5,
};

function RitualsProjects() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Layout spacing>
        <Grid container spacing={2} sx={{ marginBottom: 1, marginTop: 1 }}>
          <Grid item xs={12} sm={6}>
            <Rituals />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Projects />
          </Grid>
        </Grid>

        {/* <Grid container spacing={2} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <Rituals />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <Projects />
          </Grid>
        </Grid> */}

        <Grid container spacing={2} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <QualitiesGenerator />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <Weapons />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <CustomWeapons />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ marginBottom: 3, marginTop: 1 }}>
          <Grid item xs={12}>
            <ArmorShield />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ marginBottom: 5, marginTop: 1 }}>
          <Grid item xs={12}>
            <Accessories />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ marginBottom: 5, marginTop: 1 }}>
          <Grid item xs={12}>
            <Arcana />
          </Grid>
        </Grid>

      </Layout>
    </ThemeProvider>
  );
}

function Rituals() {
  const { t } = useTranslate();
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const [power, setPower] = useState("minor");
  const [area, setArea] = useState("individual");
  const [ingredient, setIngredient] = useState(false);
  const [itemHeld, setItemHeld] = useState(false);
  const [dlReduction, setDLReduction] = useState(2);
  const [fastRitual, setFastRitual] = useState(false);
  const ingredientMod = ingredient ? 0.5 : 1;
  const itemHeldMod = itemHeld ? dlReduction : 0;

  function calcPM() {
    return powerPMs[power] * areaPMs[area] * ingredientMod;
  }

  function calcLD() {
    return powerLDs[power] - itemHeldMod;
  }

  function calcClock() {
    let clockValue = powerClocks[power];
    if (fastRitual && clockValue >= 6) {
      clockValue -= 2;
    }
    return clockValue;
  }
  return (
    <>
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
        <CustomHeaderAlt headerText={t("Rituals")} icon={<Spa fontSize="large" />} />
        <Grid container>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Potency")}</FormLabel>
              <RadioGroup
                aria-label="power"
                name="power-group"
                value={power}
                onChange={(e) => {
                  setPower(e.target.value);
                }}
              >
                <FormControlLabel
                  value="minor"
                  control={<Radio />}
                  label={t("Minor")}
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label={t("Medium")}
                />
                <FormControlLabel
                  value="major"
                  control={<Radio />}
                  label={t("Major")}
                />
                <FormControlLabel
                  value="extreme"
                  control={<Radio />}
                  label={t("Extreme")}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Area")}</FormLabel>
              <RadioGroup
                aria-label="area"
                name="area-group"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                }}
              >
                <FormControlLabel
                  value="individual"
                  control={<Radio />}
                  label={t("Individual")}
                />
                <FormControlLabel
                  value="small"
                  control={<Radio />}
                  label={t("Small")}
                />
                <FormControlLabel
                  value="large"
                  control={<Radio />}
                  label={t("Large")}
                />
                <FormControlLabel
                  value="huge"
                  control={<Radio />}
                  label={t("Huge")}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Reductions")}</FormLabel>

              <FormControlLabel
                control={<Checkbox value={ingredient} />}
                onChange={(e) => {
                  setIngredient(e.target.checked);
                }}
                label={t("Using special ingredient")}
              />

              <FormControlLabel
                control={<Checkbox value={itemHeld} />}
                onChange={(e) => {
                  setItemHeld(e.target.checked);
                }}
                label={t("Override DL")}
              />
              {itemHeld && (
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="dlReduction">
                    {t("DL Reduction")}
                  </InputLabel>
                  <Input
                    id="dlReduction"
                    type="number"
                    value={dlReduction}
                    onChange={(e) => setDLReduction(e.target.value)}
                  />
                </FormControl>
              )}

              <FormControlLabel
                control={<Checkbox value={fastRitual} />}
                onChange={(e) => {
                  setFastRitual(e.target.checked);
                }}
                label={t("Fast Ritual")}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Divider />
        <Grid container sx={{ m: 1 }}>
          <Grid item xs={4}>
            <Typography fontWeight="bold">
              {calcPM()} {t("MP")}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight="bold">
              {calcLD()} {t("DL")}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight="bold">
              {t("Clock")} {calcClock()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
function Projects() {
  const { t } = useTranslate();
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const [power, setPower] = useState("minor");
  const [area, setArea] = useState("individual");
  const [uses, setUses] = useState("consumable");
  const [defect, setDefect] = useState(false);
  const [tinkerers, setThinkerers] = useState(1);
  const [helpers, setHelpers] = useState(0);
  const [visionary, setVisionary] = useState(0);

  const defectMod = defect ? 0.75 : 1;
  const cost =
    powerCosts[power] * areaCosts[area] * usesCosts[uses] * defectMod;
  const progress = Math.ceil(cost / 100 > 1 ? cost / 100 : 1);
  const progressPerDay = tinkerers * 2 + helpers + visionary;
  const days = progress / progressPerDay;

  return (
    <>
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
        <CustomHeaderAlt headerText={t("Projects")} icon={<Spa fontSize="large" />} />
        <Grid container>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Potency")}</FormLabel>
              <RadioGroup
                aria-label="power"
                name="power-group"
                value={power}
                onChange={(e) => {
                  setPower(e.target.value);
                }}
              >
                <FormControlLabel
                  value="minor"
                  control={<Radio />}
                  label={t("Minor")}
                />
                <FormControlLabel
                  value="medium"
                  control={<Radio />}
                  label={t("Medium")}
                />
                <FormControlLabel
                  value="major"
                  control={<Radio />}
                  label={t("Major")}
                />
                <FormControlLabel
                  value="extreme"
                  control={<Radio />}
                  label={t("Extreme")}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Area")}</FormLabel>
              <RadioGroup
                aria-label="area"
                name="area-group"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                }}
              >
                <FormControlLabel
                  value="individual"
                  control={<Radio />}
                  label={t("Individual")}
                />
                <FormControlLabel
                  value="small"
                  control={<Radio />}
                  label={t("Small")}
                />
                <FormControlLabel
                  value="large"
                  control={<Radio />}
                  label={t("Large")}
                />
                <FormControlLabel
                  value="huge"
                  control={<Radio />}
                  label={t("Huge")}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("Uses")}</FormLabel>
              <RadioGroup
                aria-label="uses"
                name="uses-group"
                value={uses}
                onChange={(e) => {
                  setUses(e.target.value);
                }}
              >
                <FormControlLabel
                  value="consumable"
                  control={<Radio />}
                  label={t("Consumable")}
                />
                <FormControlLabel
                  value="permanent"
                  control={<Radio />}
                  label={t("Permanent")}
                />
              </RadioGroup>
              <br />
              <FormControlLabel
                control={<Checkbox value={defect} />}
                onChange={(e) => {
                  setDefect(e.target.checked);
                }}
                label={t("Has terrible flaw")}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <FormControl variant="standard" fullWidth>
              <TextField
                id="tinkerers"
                label={t("Number of Tinkerers")}
                type="number"
                size="small"
                min={1}
                max={10}
                value={tinkerers}
                onChange={(e) => {
                  if (e.target.value !== "")
                    setThinkerers(parseInt(e.target.value));
                  else setThinkerers(0);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="standard" fullWidth>
              <TextField
                id="helpers"
                label={t("Number of Hired Helpers")}
                type="number"
                size="small"
                min={1}
                max={10}
                value={helpers}
                onChange={(e) => {
                  if (e.target.value !== "")
                    setHelpers(parseInt(e.target.value));
                  else setHelpers(0);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="standard" fullWidth>
              <TextField
                id="visionary"
                label={t("Levels in Visionary")}
                type="number"
                size="small"
                min={1}
                max={10}
                value={visionary}
                onChange={(e) => {
                  if (e.target.value !== "")
                    setVisionary(parseInt(e.target.value));
                  else setVisionary(0);
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight="bold">
              {cost} {t("Zenit")}
            </Typography>
            {visionary > 0 && (
              <Typography fontWeight="bold">
                {visionary * 100} {t("Cost covered by Visionary")}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight="bold">
              {progress} {t("Progress")}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {days < 1 && (
              <Typography fontWeight="bold">
                {t("Number of days")} {Math.ceil(days)}
              </Typography>
            )}
            {days >= 1 && (
              <Typography fontWeight="bold">
                {progressPerDay} {t("progress per day")}/ {Math.ceil(days)}{" "}
                {t("days")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

const damageTypes = [
  "physical",
  "wind",
  "bolt",
  "dark",
  "earth",
  "fire",
  "ice",
  "light",
  "poison",
];

const species = [
  "beast",
  "construct",
  "demon",
  "elemental",
  "humanoid",
  "monster",
  "plant",
  "undead",
];

const attributes = ["dexterity", "insight", "strength", "willpower"];

const statuses = ["dazed", "weak", "slow", "shaken", "poisoned", "enraged"];

function QualitiesGenerator() {
  const { t } = useTranslate();
  const theme = useCustomTheme();
  const background = theme.mode === 'dark'
  ? `linear-gradient(to right, ${theme.primary}, ${theme.quaternary})`
  : `linear-gradient(to right, ${theme.ternary}, transparent)`;
  const [selectedDamageType, setSelectedDamageType] = useState("All");
  const [selectedSpecies, setSelectedSpecies] = useState("All");
  const [selectedAttributes, setSelectedAttributes] = useState("All");
  const [selectedStatuses, setSelectedStatues] = useState("All");
  const [generate, setGenerate] = useState(0);
  const [currentGeneratedText, setCurrentGeneratedText] = useState('');
  
  const generatePrefixes = () => {
    const prefixes = [];
    randomQualities.forEach((item) => {
      if (item.Conditions && item.Conditions !== "") {
        if (item.Conditions.includes("{type}")) {
          if (selectedDamageType === "All") {
            damageTypes.forEach((type) => {
              prefixes.push(item.Conditions.replace("{type}", type));
            });
          } else
            prefixes.push(
              item.Conditions.replace("{type}", selectedDamageType)
            );
        } else if (item.Conditions.includes("{species}")) {
          if (selectedSpecies === "All") {
            species.forEach((speciesGet) => {
              prefixes.push(item.Conditions.replace("{species}", speciesGet));
            });
          } else
            prefixes.push(
              item.Conditions.replace("{species}", selectedSpecies)
            );
        } else if (item.Conditions.includes("{status}")) {
          if (selectedStatuses === "All") {
            statuses.forEach((status) => {
              prefixes.push(item.Conditions.replace("{status}", status));
            });
          } else
            prefixes.push(
              item.Conditions.replace("{status}", selectedStatuses)
            );
        } else {
          prefixes.push(item.Conditions);
        }
      }
    });
    return prefixes;
  };

  const generateSuffixes = () => {
    const prefixes = [];
    randomQualities.forEach((item) => {
      if (item.Effects && item.Effects !== "") {
        if (item.Effects.includes("{type}")) {
          if (selectedDamageType === "All") {
            damageTypes.forEach((type) => {
              prefixes.push(item.Effects.replace("{type}", type));
            });
          } else
            prefixes.push(item.Effects.replace("{type}", selectedDamageType));
        } else if (item.Effects.includes("{species}")) {
          if (selectedSpecies === "All") {
            species.forEach((speciesGet) => {
              prefixes.push(item.Effects.replace("{species}", speciesGet));
            });
          } else
            prefixes.push(item.Effects.replace("{species}", selectedSpecies));
        } else if (item.Effects.includes("{status}")) {
          if (selectedStatuses === "All") {
            statuses.forEach((status) => {
              prefixes.push(item.Effects.replace("{status}", status));
            });
          } else
            prefixes.push(item.Effects.replace("{status}", selectedStatuses));
        } else if (item.Effects.includes("{attribute}")) {
          if (selectedAttributes === "All") {
            attributes.forEach((attribute) => {
              prefixes.push(item.Effects.replace("{attribute}", attribute));
            });
          } else
            prefixes.push(
              item.Effects.replace("{attribute}", selectedAttributes)
            );
        } else {
          prefixes.push(item.Effects);
        }
      }
    });
    return prefixes;
  };

  const prefixes = useMemo(generatePrefixes, [
    selectedDamageType,
    selectedSpecies,
    selectedStatuses,
  ]);
  const suffixes = useMemo(generateSuffixes, [
    selectedDamageType,
    selectedSpecies,
    selectedStatuses,
    selectedAttributes,
  ]);

  const getRandomPrefix = () => {
    return prefixes[Math.floor(Math.random() * prefixes.length)];
  };

  const getRandomSuffix = () => {
    return suffixes[Math.floor(Math.random() * suffixes.length)];
  };

  const generateRandomValues = () => {
    const prefix = getRandomPrefix();
    const suffix = getRandomSuffix();
    setCurrentGeneratedText(`${prefix}, ${suffix}`);
  };
  
  useEffect(() => {
    generateRandomValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generate]); 

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: "14px",
          borderRadius: "8px",
          border: "2px solid",
          borderColor: theme.secondary,
        }}
      >
        {/* Header */}
        <CustomHeaderAlt headerText={t("Qualities Generator")} icon={<AutoAwesome fontSize="large" />} />
        <Grid container spacing={1} sx={{ my: 1 }}>
          <Grid item xs={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              defaultValue={"All"}
              value={selectedDamageType}
              options={["All", ...damageTypes]}
              size="small"
              onChange={(evt, val2) => {
                if (val2) {
                  setSelectedDamageType(val2);
                } else setSelectedDamageType("All");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Damage Type" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              value={selectedSpecies}
              options={["All", ...species]}
              size="small"
              onChange={(evt, val2) => {
                if (val2) {
                  setSelectedSpecies(val2);
                } else setSelectedSpecies("All");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Species" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              value={selectedAttributes}
              options={["All", ...attributes]}
              size="small"
              onChange={(evt, val2) => {
                if (val2) {
                  setSelectedAttributes(val2);
                } else setSelectedAttributes("All");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Attributes" />
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              value={selectedStatuses}
              options={["All", ...statuses]}
              size="small"
              onChange={(evt, val2) => {
                if (val2) {
                  setSelectedStatues(val2);
                } else setSelectedStatues("All");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Statuses" />
              )}
            />
          </Grid>
        </Grid>

        <Paper
          sx={{
            background,
            padding: 2,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              px: 1,
              flex: 1,
            }}
          >
            {" "}
            {currentGeneratedText}
          </Typography>
          <Button
            variant="contained"
            startIcon={<RestartAltOutlined />}
            onClick={() => {
              setGenerate(generate + 1);
              generateRandomValues(); 
            }}
            sx={{
              minWidth: 100,
              fontWeight: "bold",
              mr: 1,
            }}
          >
            Generate
          </Button>
          <CopyToClipboard textToCopy={currentGeneratedText} />
        </Paper>
        <Typography sx={{ fontSize: 14, marginLeft: 1 }}>
          Warning: Some effects are imbalanced, use with caution!
        </Typography>
      </Paper>
    </>
  );
}

export default RitualsProjects;
