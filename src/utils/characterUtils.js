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

export function getClassBasedProficiencies(classes = []) {
    const armorSet = new Set();
    const weaponCategorySet = new Set();
    const namedWeaponSet = new Set();

    const generalCategories = ['Simple', 'Martial'];

    classes.forEach(cls => {
        const profs = classProficiencies[cls.name];
        if (profs) {
            // Armor
            profs.armor?.forEach(a => armorSet.add(a));

            // Weapons
            profs.weapons?.forEach(w => {
                if (generalCategories.includes(w)) {
                    weaponCategorySet.add(w);
                } else {
                    namedWeaponSet.add(w);
                }
            });
        }
    });

    return {
        armor: Array.from(armorSet),
        weaponCategories: Array.from(weaponCategorySet),
        namedWeapons: Array.from(namedWeaponSet),
    };
}





export function getWeaponAttackBonus(character, weapon) {
    const stats = character.stats || {};
    const strMod = getModifier(stats.strength || 10);
    const dexMod = getModifier(stats.dexterity || 10);

    let statMod = strMod;
    if (weapon.finesse) {
        statMod = Math.max(strMod, dexMod);
    } else if (weapon.ranged) {
        statMod = dexMod;
    }

    const totalLevel = getTotalLevel(character.classes || []);
    const profBonus = getProficiencyBonus(totalLevel);

    const classProfs = getClassBasedProficiencies(character.classes || []);

    const isProficient =
        classProfs.weaponCategories.includes(weapon.weaponClass) ||
        classProfs.namedWeapons.includes(weapon.weaponType) ||
        classProfs.namedWeapons.includes(weapon.name); // if you ever store names directly

    return statMod + (isProficient ? profBonus : 0);
}



export function getArmorClass(character) {
    const dexMod = getModifier(character.stats?.dexterity || 10);
    const items = character.items || [];

    const armor = items.find(item => item.type === 'Armor' && item.armorCategory !== 'Shield');
    const shield = items.find(item => item.type === 'Armor' && item.armorCategory === 'Shield');

    let baseAC = 10;
    let maxDexBonus = null;
    let dexApplies = true;

    if (armor) {
        baseAC = armor.baseAC || baseAC;
        dexApplies = armor.dexModifierApplies ?? true;
        maxDexBonus = armor.maxDexBonus ?? null;
    }

    let totalDex = 0;
    if (dexApplies) {
        totalDex = maxDexBonus != null ? Math.min(dexMod, maxDexBonus) : dexMod;
    }

    let shieldBonus = shield?.acBonus || 0;

    return baseAC + totalDex + shieldBonus;
}



