export const classProficiencies = {
    Barbarian: {
      weapons: ['Simple', 'Martial'],
      armor: ['Light', 'Medium', 'Shields']
    },
    Bard: {
      weapons: ['Simple', 'Hand Crossbow', 'Longsword', 'Rapier', 'Shortsword'],
      armor: ['Light']
    },
    Cleric: {
      weapons: ['Simple'],
      armor: ['Light', 'Medium', 'Shields']
    },
    Druid: {
      weapons: ['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff', 'Scimitar', 'Sickle', 'Sling', 'Spear'],
      armor: ['Light', 'Medium', 'Shields']
    },
    Fighter: {
      weapons: ['Simple', 'Martial'],
      armor: ['Light', 'Medium', 'Heavy', 'Shields']
    },
    Monk: {
      weapons: ['Simple', 'Shortsword'],
      armor: []
    },
    Paladin: {
      weapons: ['Simple', 'Martial'],
      armor: ['Light', 'Medium', 'Heavy', 'Shields']
    },
    Ranger: {
      weapons: ['Simple', 'Martial'],
      armor: ['Light', 'Medium', 'Shields']
    },
    Rogue: {
      weapons: ['Simple', 'Hand Crossbow', 'Longsword', 'Rapier', 'Shortsword'],
      armor: ['Light']
    },
    Sorcerer: {
      weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow'],
      armor: []
    },
    Warlock: {
      weapons: ['Simple'],
      armor: ['Light']
    },
    Wizard: {
      weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light Crossbow'],
      armor: []
    }
  };
  
  export const getModifier = (score) => Math.floor((score - 10) / 2);
  
  export const getProficiencyBonus = (level) => {
    if (level >= 17) return 6;
    if (level >= 13) return 5;
    if (level >= 9) return 4;
    if (level >= 5) return 3;
    return 2;
  };
  
  export const getTotalLevel = (classes = []) => {
    if (!Array.isArray(classes)) return 0;
    return classes.reduce((total, cls) => total + (cls.level || 0), 0);
  };
  
  export const getExpertiseSlots = (classes = []) => {
    return classes.reduce((total, cls) => {
      if (cls.name === 'Rogue') {
        if (cls.level >= 6) return total + 4;
        if (cls.level >= 1) return total + 2;
      }
      if (cls.name === 'Bard' && cls.level >= 3) return total + 2;
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
  
  export const getClassBasedProficiencies = (classes = []) => {
    const armorSet = new Set();
    const weaponCategorySet = new Set();
    const namedWeaponSet = new Set();
    const generalCategories = ['Simple', 'Martial'];
  
    classes.forEach(cls => {
      const profs = classProficiencies[cls.name];
      if (profs) {
        profs.armor?.forEach(a => armorSet.add(a));
        profs.weapons?.forEach(w => {
          if (generalCategories.includes(w)) weaponCategorySet.add(w);
          else namedWeaponSet.add(w);
        });
      }
    });
  
    return {
      armor: Array.from(armorSet),
      weaponCategories: Array.from(weaponCategorySet),
      namedWeapons: Array.from(namedWeaponSet),
    };
  };
  
  export const getWeaponAttackBonus = (character, weapon) => {
    const stats = character.stats || {};
    const strMod = getModifier(stats.strength || 10);
    const dexMod = getModifier(stats.dexterity || 10);
  
    const properties = weapon.weaponProperties || [];
    const isFinesse = properties.includes('Finesse');
    const isRanged = weapon.weaponRangeCategory === 'Ranged';
  
    let statMod = isRanged ? dexMod : isFinesse ? Math.max(strMod, dexMod) : strMod;
  
    const totalLevel = getTotalLevel(character.classes || []);
    const profBonus = getProficiencyBonus(totalLevel);
    const classProfs = getClassBasedProficiencies(character.classes || []);
  
    const isProficient =
      classProfs.weaponCategories.includes(weapon.weaponClass) ||
      classProfs.namedWeapons.includes(weapon.weaponType) ||
      classProfs.namedWeapons.includes(weapon.name);
  
    return statMod + (isProficient ? profBonus : 0);
  };

  export const getWeaponDamageBonus = (character, weapon) => {
    const stats = character.stats || {};
    const strMod = getModifier(stats.strength || 10);
    const dexMod = getModifier(stats.dexterity || 10);
  
    const properties = weapon.weaponProperties || [];
    const isFinesse = properties.includes('Finesse');
    const isRanged = weapon.weaponRangeCategory === 'Ranged';
  
    let statMod = isRanged ? dexMod : isFinesse ? Math.max(strMod, dexMod) : strMod;
  
    const classProfs = getClassBasedProficiencies(character.classes || []);
  
    const isProficient =
      classProfs.weaponCategories.includes(weapon.weaponClass) ||
      classProfs.namedWeapons.includes(weapon.weaponType) ||
      classProfs.namedWeapons.includes(weapon.name);
  
    return statMod;
  };
  
  export const getArmorClass = (character) => {
    const dexMod = getModifier(character.stats?.dexterity || 10);
    const items = character.items || [];
  
    const armor = items.find(item => item.type === 'Armor' && item.armorCategory !== 'Shield');
    const shield = items.find(item => item.type === 'Armor' && item.armorCategory === 'Shield');
  
    let baseAC = armor?.armorClassBase || 10;
    const dexApplies = armor?.usesDexModifier ?? true;
    const maxDexBonus = armor?.dexModifierCap ?? null;
  
    let totalDex = dexApplies ? (maxDexBonus != null ? Math.min(dexMod, maxDexBonus) : dexMod) : 0;
    const shieldBonus = shield?.acBonus || 0;
  
    return baseAC + totalDex + shieldBonus;
  };
  
  export const getMaxSpellLevel = (casterType, classLevel) => {
    if (classLevel < 1) return 0;
    if (casterType === 'full') return Math.min(Math.floor((classLevel + 1) / 2), 9);
    if (casterType === 'half') return Math.min(Math.floor(classLevel / 2), 5);
    return 0;
  };
  
  export const handleClassChange = (form, setForm, index, field, value) => {
    const updatedClasses = [...form.classes];
    updatedClasses[index] = {
      ...updatedClasses[index],
      [field]: field === 'level' ? Number(value) : value
    };
    if (field === 'name') updatedClasses[index].subclass = '';
    setForm(prev => ({ ...prev, classes: updatedClasses }));
  };
  
  export const handleSubclassChange = (form, setForm, index, subclassName) => {
    const updatedClasses = [...form.classes];
    updatedClasses[index] = {
      ...updatedClasses[index],
      subclass: subclassName
    };
    setForm(prev => ({ ...prev, classes: updatedClasses }));
  };
  
  export const addClass = (setForm) => {
    setForm(prev => ({
      ...prev,
      classes: [...prev.classes, { name: '', level: 1, subclass: '' }]
    }));
  };

  export const removeClass = (setForm, index, form, setSelectedSpells) => {
    const classNameToRemove = form.classes[index]?.name;
    if (!classNameToRemove) return;
  
    // Remove the class
    setForm(prev => ({
      ...prev,
      classes: prev.classes.filter((_, i) => i !== index)
    }));
  
    // Remove any spells associated with the removed class
    setSelectedSpells(prev => {
      const updated = { ...prev };
      delete updated[classNameToRemove];
      return updated;
    });
  };
  

  
  export const getSpellcastingAbility = (className) => {
    const chaClasses = ['Bard', 'Paladin', 'Sorcerer', 'Warlock'];
    const wisClasses = ['Cleric', 'Druid', 'Ranger'];
    const intClasses = ['Wizard'];
  
    if (chaClasses.includes(className)) return 'charisma';
    if (wisClasses.includes(className)) return 'wisdom';
    if (intClasses.includes(className)) return 'intelligence';
    return null;
  };
  
  export const calculateSpellSaveDC = (character, totalLevel) => {
    const spellcastingClasses = [
      'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard',
      'Paladin', 'Ranger', 'Warlock'
    ];
  
    const casterClass = character.classes.find(cls =>
      spellcastingClasses.includes(cls.name)
    );
    if (!casterClass) return null;
  
    const castingStat = getSpellcastingAbility(casterClass.name);
    const statMod = Math.floor((character.stats[castingStat] - 10) / 2);
    const prof = getProficiencyBonus(totalLevel);
  
    return 8 + statMod + prof;
  };

  export const calculateSpellAttack = (character, totalLevel) => {
    const spellcastingClasses = [
      'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard',
      'Paladin', 'Ranger', 'Warlock'
    ];
  
    const casterClass = character.classes.find(cls =>
      spellcastingClasses.includes(cls.name)
    );
    if (!casterClass) return null;
  
    const castingStat = getSpellcastingAbility(casterClass.name);
    const statMod = Math.floor((character.stats[castingStat] - 10) / 2);
    const prof = getProficiencyBonus(totalLevel);
  
    return statMod + prof;
  }

  export const hitDieByClass = {
    Barbarian: 12,
    Fighter: 10,
    Paladin: 10,
    Ranger: 10,
    Bard: 8,
    Cleric: 8,
    Druid: 8,
    Monk: 8,
    Rogue: 8,
    Warlock: 8,
    Sorcerer: 6,
    Wizard: 6,
  };
  
  export const averageHitDie = {
    6: 4,
    8: 5,
    10: 6,
    12: 7,
  };

  export const calculateTotalHP = (classes, conModifier) => {
    return classes.reduce((total, cls, index) => {
      const hitDie = hitDieByClass[cls.name];
      const average = averageHitDie[hitDie];
      const level = cls.level;
  
      if (index === 0) {
        return hitDie + (level - 1) * (average + conModifier);
      } else {
        return total + level * (average + conModifier);
      }
    }, 0);
  };
  
  
  