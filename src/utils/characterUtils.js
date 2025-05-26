
export const getModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };
  
  export const getProficiencyBonus = (level) => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  };
  
  export function getTotalLevel(classes = []) {
    if (!Array.isArray(classes)) return 0;
    return classes.reduce((total, cls) => total + (cls.level || 0), 0);
  }
  
  export const getExpertiseSlots = (classes = []) => {
    return classes.reduce((total, cls) => {
      if (cls.name === 'Rogue') {
        if (cls.level >= 6) return total + 4;
        if (cls.level >= 1) return total + 2;
      }
      if (cls.name === 'Bard' && cls.level >= 3) {
        return total + 2;
      }
      return total;
    }, 0);
  };
  
  export const hasJackOfAllTrades = (classes = []) => {
    return classes.some(cls => cls.name === 'Bard' && cls.level >= 2);
  };
  
  export const skillToStatMap = {
    "Acrobatics": "dexterity",
    "Animal Handling": "wisdom",
    "Arcana": "intelligence",
    "Athletics": "strength",
    "Deception": "charisma",
    "History": "intelligence",
    "Insight": "wisdom",
    "Intimidation": "charisma",
    "Investigation": "intelligence",
    "Medicine": "wisdom",
    "Nature": "intelligence",
    "Perception": "wisdom",
    "Performance": "charisma",
    "Persuasion": "charisma",
    "Religion": "intelligence",
    "Sleight of Hand": "dexterity",
    "Stealth": "dexterity",
    "Survival": "wisdom"
  };



  export function getWeaponAttackBonus(character, weapon) {
    const getModifier = (score) => Math.floor((score - 10) / 2);

    const totalLevel = getTotalLevel(character);
    const profBonus = getProficiencyBonus(totalLevel);

    const stats = character.stats || {};
    const strMod = getModifier(stats.strength || 10);
    const dexMod = getModifier(stats.dexterity || 10);

    let statMod = strMod;
    if (weapon.finesse) {
        statMod = Math.max(strMod, dexMod);
    } else if (weapon.ranged) {
        statMod = dexMod; 
    }

    const isProficient = character.proficiencies?.weapons?.includes(weapon.name);

    return statMod + (isProficient ? profBonus : 0);
}

  