import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTranslate } from "../../../translation/translate";
import { categories } from "./libs";

function ChangeCategory({ value, onChange }) {
  const { t } = useTranslate();

  return (
    <FormControl fullWidth>
      <InputLabel id="type">{t("weapon_category")}</InputLabel>
      <Select
        labelId="type"
        id="select-type"
        value={value}
        label={t("weapon_category")}
        onChange={onChange}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {t(category)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChangeCategory;
