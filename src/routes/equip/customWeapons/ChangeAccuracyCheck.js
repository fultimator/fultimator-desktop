import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTranslate } from "../../../translation/translate";
import { accuracyChecks } from "./libs";
import {attrNoTranslation} from "../../../libs/attributes";

function ChangeAccuracyCheck({ value, onChange }) {
  const { t } = useTranslate();

  const handleChange = (event) => {
    const [att1, att2] = event.target.value.split("_");
    onChange({ att1, att2 });
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="type">{t("weapon_accuracy_check")}</InputLabel>
      <Select
        labelId="type"
        id="select-type"
        value={`${value.att1}_${value.att2}`}
        label={t("weapon_accuracy_check")}
        onChange={handleChange}
      >
        {accuracyChecks.map((check, index) => (
          <MenuItem key={index} value={`${check.att1}_${check.att2}`}>
            {`【${attrNoTranslation[check.att1]?.shortcaps || t(check.att1)} + ${
              attrNoTranslation[check.att2]?.shortcaps || t(check.att2)
            }】`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ChangeAccuracyCheck;
