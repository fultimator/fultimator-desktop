import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTranslate } from "../../../translation/translate";
import { range } from "./libs";

function ChangeRange({ value, onChange }) {
  const { t } = useTranslate();

  return (
    <FormControl fullWidth>
      <InputLabel id="type">{t("weapon_range")}</InputLabel>
      <Select
        labelId="type"
        id="select-type"
        value={value}
        label={t("weapon_range")}
        onChange={onChange}
      >
        {range.map((range) => (
          <MenuItem key={range} value={range}>
            {t(range)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChangeRange;
