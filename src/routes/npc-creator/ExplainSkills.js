import { Card, Typography } from "@mui/material";
import {
  calcSkillsCurrent,
  calcSkillsCurrentAbsorbs,
  calcSkillsCurrentAttacks,
  calcSkillsCurrentDefs,
  calcSkillsCurrentImmunities,
  calcSkillsCurrentResistances,
  calcSkillsCurrentSpecial,
  calcSkillsMax,
  calcSkillsMaxType,
  calcSkillsMaxVulnerabilities,
} from "./skills/Skills";

function ExplainSkills({ npc }) {
  const skillsFromAttacks = calcSkillsCurrentAttacks(npc);
  const skillsFromType = calcSkillsMaxType(npc);
  const skillsFromVulnerabilities = calcSkillsMaxVulnerabilities(npc);
  const skillsFromResistances = calcSkillsCurrentResistances(npc);
  const skillsFromImmunities = calcSkillsCurrentImmunities(npc);
  const skillsFromAbsorbs = calcSkillsCurrentAbsorbs(npc);
  const skillsFromSpecial = calcSkillsCurrentSpecial(npc);
  const skillsFromDefs = calcSkillsCurrentDefs(npc);

  return (
    <Card sx={{ p: 1.61 }}>
      <Typography>
        Abilità totali: <strong>{calcSkillsMax(npc)}</strong>
      </Typography>
      <Typography component="ul" sx={{ pl: 2.5 }}>
        <li>
          Specie x <strong>{skillsFromType}</strong>
        </li>
        <li>
          Vulnerabilità x <strong>{skillsFromVulnerabilities}</strong>
        </li>
      </Typography>
      <Typography>
        Abilità usate: <strong>{calcSkillsCurrent(npc)}</strong>
      </Typography>
      <Typography component="ul" sx={{ pl: 2.5 }}>
        <li>
          Attacco Speciale x <strong>{skillsFromAttacks}</strong>
        </li>
        <li>
          Resistenza al danno x <strong>{skillsFromResistances}</strong>
        </li>
        <li>
          Immunità al danno x <strong>{skillsFromImmunities}</strong>
        </li>
        <li>
          Assorbimento del danno x <strong>{skillsFromAbsorbs}</strong>
        </li>
        <li>
          Regole speciali x <strong>{skillsFromSpecial}</strong>
        </li>
        <li>
          Difese x <strong>{skillsFromDefs}</strong>
        </li>
      </Typography>
    </Card>
  );
}

export default ExplainSkills;
