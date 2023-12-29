import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import {
  Grid,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import attributes from "../../libs/attributes";
import { baseWeapons } from "../../libs/equip";
import { CloseBracket, OpenBracket } from "../Bracket";

export default function EditWeaponAttacks({ npc, setNpc }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const onChangeAttacks = (i) => {
    return (key, value) => {
      setNpc((prevState) => {
        const newState = Object.assign({}, prevState);
        newState.weaponattacks[i][key] = value;
        return newState;
      });
    };
  };

  const addAttack = () => {
    setNpc((prevState) => {
      const newState = Object.assign({}, prevState);
      if (!newState.weaponattacks) {
        newState.weaponattacks = [];
      }
      newState.weaponattacks.push({
        name: "",
        weapon: baseWeapons[0],
        special: [],
      });
      return newState;
    });
  };

  const removeAttack = (i) => {
    return () => {
      setNpc((prevState) => {
        const newState = Object.assign({}, prevState);
        newState.weaponattacks.splice(i, 1);
        return newState;
      });
    };
  };

  return (
    <>
      <Typography fontFamily="Antonio" fontSize="1.3rem">
        Attacks with Weapons
        <IconButton onClick={addAttack}>
          <AddCircleOutline />
        </IconButton>
      </Typography>

      {npc.weaponattacks?.map((attack, i) => {
        return (
          <Grid container key={i} spacing={isSmallScreen ? 0 : 1}>
            <Grid item xs={isSmallScreen ? 12 : isMediumScreen ? 10 : 5}>
              <EditAttack
                attack={attack}
                setAttack={onChangeAttacks(i)}
                removeAttack={removeAttack(i)}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <EditAttackSpecial
                attack={attack}
                setAttack={onChangeAttacks(i)}
              />
            </Grid>
            {i !== npc.weaponattacks.length - 1 && (
              <Grid item xs={12} sx={{ py: isSmallScreen ? 1 : 2 }}>
                <Divider />
              </Grid>
            )}
          </Grid>
        );
      })}
    </>
  );
}

function EditAttack({ attack, setAttack, removeAttack, i }) {
  return (
    <Grid container spacing={1} sx={{ py: 1 }} alignItems="center">
      <Grid item sx={{ mx: -1 }}>
        <IconButton onClick={removeAttack}>
          <RemoveCircleOutline />
        </IconButton>
      </Grid>
      <Grid item xs={11}>
        <FormControl variant="standard" fullWidth>
          <TextField
            id="name"
            label="Name:"
            value={attack.name}
            onChange={(e) => {
              return setAttack("name", e.target.value);
            }}
            size="small"
          ></TextField>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SelectWeapon
          weapon={attack.weapon}
          setWeapon={(value) => {
            return setAttack("weapon", value);
          }}
          size="small"
        />
      </Grid>
      <Grid item xs={3} sm={3}>
        <FormControl variant="standard">
          <TextField
            id="flathit"
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Acc."
            value={attack.flathit || 0}
            onChange={(e) => {
              return setAttack("flathit", e.target.value);
            }}
            size="small"
          ></TextField>
        </FormControl>
      </Grid>
      <Grid item xs={3} sm={3}>
        <FormControl variant="standard">
          <TextField
            id="flatdmg"
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            label="Dmg."
            value={attack.flatdmg || 0}
            onChange={(e) => {
              return setAttack("flatdmg", e.target.value);
            }}
            size="small"
          ></TextField>
        </FormControl>
      </Grid>
      <Grid item xs={4} lg={2}>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="medium"
                value={attack.extraDamage}
                onChange={(e, value) => {
                  return setAttack("extraDamage", e.target.checked);
                }}
              />
            }
            label="Extra Damage"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
}

function EditAttackSpecial({ attack, setAttack }) {
  const [specials, setSpecials] = useState(attack.special.join("/n"));

  useEffect(() => {
    setSpecials(attack.special.join("\n"));
  }, [attack.special, setSpecials]);

  const onChange = (e) => {
    if (e.target.value === "") {
      setAttack("special", []);
      return;
    }

    const parts = e.target.value.split("\n");
    setAttack("special", parts);
  };

  return (
    <Grid container spacing={1} sx={{ py: 1 }} alignItems="center">
      <Grid item xs={12}>
        <FormControl variant="standard" fullWidth>
          <TextField
            id="special"
            label="Special:"
            multiline
            value={specials}
            onChange={onChange}
            size="small"
            helperText="Adding a special effect cost 1 skill point"
          ></TextField>
        </FormControl>
      </Grid>
    </Grid>
  );
}

function SelectWeapon({ weapon, setWeapon }) {
  const onChange = function (e) {
    const weapon = baseWeapons.find((weapon) => weapon.name === e.target.value);

    setWeapon(weapon);
  };

  const options = [<MenuItem key={1} value="" disabled />];

  for (const weapon of baseWeapons) {
    options.push(
      <MenuItem key={weapon.name} value={weapon.name}>
        {weapon.name} <OpenBracket />
        {attributes[weapon.att1].shortcaps}+{attributes[weapon.att2].shortcaps}
        {weapon.prec > 0 && `+${weapon.prec}`}
        <CloseBracket /> <OpenBracket />
        HR + {weapon.damage}
        <CloseBracket />
      </MenuItem>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="type">Weapon:</InputLabel>
      <Select
        labelId="type"
        id="select-type"
        value={weapon.name}
        label="Weapon"
        onChange={onChange}
        size="small"
      >
        {options}
      </Select>
    </FormControl>
  );
}
