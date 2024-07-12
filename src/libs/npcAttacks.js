import { t } from "../translation/translate";

export const npcAttacks = [
  {
    itemType: "basic",
    category: t("Arcane", true),
    name: t("Staff", true),
    cost: 100,
    attr1: "will",
    attr2: "will",
    flathit: 0,
    flatdmg: 1,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Arcane", true),
    name: t("Tome", true),
    cost: 100,
    attr1: "insight",
    attr2: "insight",
    flathit: 0,
    flatdmg: 1,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Bow", true),
    name: t("Crossbow", true),
    cost: 150,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 0,
    flatdmg: 3,
    type: "physical",
    hands: 2,
    range: "distance",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Bow", true),
    name: t("Shortbow", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "dexterity",
    flathit: 0,
    flatdmg: 3,
    type: "physical",
    hands: 2,
    range: "distance",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Flail", true),
    name: t("Chain Whip", true),
    cost: 150,
    attr1: "dexterity",
    attr2: "dexterity",
    flathit: 0,
    flatdmg: 3,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Firearm", true),
    name: t("Pistol", true),
    cost: 250,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 0,
    flatdmg: 3,
    type: "physical",
    hands: 1,
    range: "distance",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Spear", true),
    name: t("Light Spear", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "might",
    flathit: 0,
    flatdmg: 3,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Spear", true),
    name: t("Heavy Spear", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "might",
    flathit: 0,
    flatdmg: 7,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Thrown", true),
    name: t("Shuriken", true),
    cost: 150,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 0,
    flatdmg: -1,
    type: "physical",
    hands: 1,
    range: "distance",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Heavy", true),
    name: t("Iron Hammer", true),
    cost: 200,
    attr1: "might",
    attr2: "might",
    flathit: 0,
    flatdmg: 1,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Heavy", true),
    name: t("Broadaxe", true),
    cost: 250,
    attr1: "might",
    attr2: "might",
    flathit: 0,
    flatdmg: 5,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Heavy", true),
    name: t("Waraxe", true),
    cost: 250,
    attr1: "might",
    attr2: "might",
    flathit: 0,
    flatdmg: 9,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Dagger", true),
    name: t("Steel Dagger", true),
    cost: 150,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 1,
    flatdmg: -1,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Brawling", true),
    name: t("Iron Knuckle", true),
    cost: 150,
    attr1: "dexterity",
    attr2: "might",
    flathit: 0,
    flatdmg: 1,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: false
  },
  {
    itemType: "basic",
    category: t("Sword", true),
    name: t("Katana", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 1,
    flatdmg: 5,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Sword", true),
    name: t("Bronze Sword", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "might",
    flathit: 1,
    flatdmg: 1,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Sword", true),
    name: t("Greatsword", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "might",
    flathit: 1,
    flatdmg: 5,
    type: "physical",
    hands: 2,
    range: "melee",
    martial: true
  },
  {
    itemType: "basic",
    category: t("Sword", true),
    name: t("Rapier", true),
    cost: 200,
    attr1: "dexterity",
    attr2: "insight",
    flathit: 1,
    flatdmg: 1,
    type: "physical",
    hands: 1,
    range: "melee",
    martial: true
  },
];

export default npcAttacks;
