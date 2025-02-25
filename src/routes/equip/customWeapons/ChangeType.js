import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslate } from "../../../translation/translate";
import { types } from "./libs";

function ChangeType({ value, onChange, disabled }) {
  const { t } = useTranslate();

  return (
    <FormControl fullWidth>
      <InputLabel id="type">{t("weapon_damage_type")}</InputLabel>
      <Select
        labelId="type"
        id="select-type"
        value={value}
        label={t("weapon_damage_type")}
        onChange={onChange}
        disabled={disabled}
      >
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {t(type)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChangeType;
