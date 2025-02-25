export const categories = [
  "weapon_category_arcane",
  "weapon_category_bow",
  "weapon_category_brawling",
  "weapon_category_dagger",
  "weapon_category_firearm",
  "weapon_category_flail",
  "weapon_category_heavy",
  "weapon_category_spear",
  "weapon_category_sword",
  "weapon_category_thrown",
];

export const range = ["weapon_range_melee", "weapon_range_ranged"];

export const accuracyChecks = [
  {
    att1: "dexterity",
    att2: "insight",
  },
  {
    att1: "dexterity",
    att2: "might",
  }
];

export const customizations = [
    {
      name: "weapon_customization_accurate",
      effect: "weapon_customization_accurate_effect",
      martial: false,
      customCost: 1,
    },
    {
      name: "weapon_customization_defenseboost",
      effect: "weapon_customization_defenseboost_effect",
      martial: false,
      customCost: 1,
    },
    {
      name: "weapon_customization_elemental",
      effect: "weapon_customization_elemental_effect",
      martial: false,
      customCost: 1,
    },
    {
      name: "weapon_customization_magicdefenseboost",
      effect: "weapon_customization_magicdefenseboost_effect",
      martial: true,
      customCost: 1,
    },
    {
      name: "weapon_customization_powerful",
      effect: "weapon_customization_powerful_effect",
      martial: true,
      customCost: 1,
    },
    {
      name: "weapon_customization_quick",
      effect: "weapon_customization_quick_effect",
      martial: true,
      customCost: 2,
    },
    {
      name: "weapon_customization_transforming",
      effect: "weapon_customization_transforming_effect",
      martial: false,
      customCost: 1,
    }
  ];