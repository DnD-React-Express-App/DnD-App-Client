import React, { useState, useEffect, useContext } from 'react';
import { ItemContext } from '../../context/item.context';
import { createCharacter, updateCharacter } from '../../services/character.service';
import proficiencies from '../../../public/data/proficiencies.json';
import ClassTab from './CharacterTabs/ClassTab';
import SpeciesTab from './CharacterTabs/SpeciesTab';
import StatsTab from './CharacterTabs/StatsTab';
import BackgroundTab from './CharacterTabs/BackgroundTab';
import SpellTab from './CharacterTabs/SpellTab';
import EquipmentTab from './CharacterTabs/EquipmentTab';
import ProficienciesTab from './CharacterTabs/ProficienciesTab';
import {
    addClass,
    removeClass,
    getMaxSpellLevel,
    getClassBasedProficiencies
} from '../../utils/characterUtils';

const raceOptions = [
    'Human',
    'Elf',
    'Half-Elf',
    'Dwarf',
    'Halfling',
    'Gnome',
    'Half-Orc',
    'Dragonborn',
    'Tiefling',
    'Aasimar',
    'Genasi',
    'Goliath',
    'Tabaxi',
    'Triton',
    'Firbolg',
    'Kenku',
    'Lizardfolk',
    'Goblin',
    'Orc',
    'Bugbear',
];



const classOptions = [
    'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
    'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
];

const spellcastingClasses = [
    'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Paladin', 'Ranger', 'Warlock'
];

const fullCasters = ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Warlock'];
const halfCasters = ['Paladin', 'Ranger'];

const CharacterForm = ({ onSuccess, initialData = {} }) => {
    const { items } = useContext(ItemContext);

    const [currentTab, setCurrentTab] = useState('Basics');
    const [armorOptions, setArmorOptions] = useState([]);
    const [weaponOptions, setWeaponOptions] = useState([]);
    const [selectedArmor, setSelectedArmor] = useState(null);
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [speciesFeatures, setSpeciesFeatures] = useState([]);
    const [allClassFeatures, setAllClassFeatures] = useState({});
    const [allSubclassFeatures, setAllSubclassFeatures] = useState({});
    const [classBasedProficiencies, setClassBasedProficiencies] = useState({ armor: [], weaponCategories: [], namedWeapons: [] });
    const [classFeatures, setClassFeatures] = useState([]);
    const [backgroundFeatures, setBackgroundFeatures] = useState([]);
    const [classSpellLists, setClassSpellLists] = useState({});
    const [selectedSpells, setSelectedSpells] = useState({});

    const [form, setForm] = useState({
        name: initialData.name || '',
        race: initialData.race || '',
        stats: {
            strength: initialData.stats?.strength ?? 10,
            dexterity: initialData.stats?.dexterity ?? 10,
            constitution: initialData.stats?.constitution ?? 10,
            intelligence: initialData.stats?.intelligence ?? 10,
            wisdom: initialData.stats?.wisdom ?? 10,
            charisma: initialData.stats?.charisma ?? 10,
        },
        classes: initialData.classes || [{ name: '', level: 1, subclass: '' }],
        level: initialData.level || 1,
        background: initialData.background || '',
        backstory: initialData.backstory || '',
        proficiencies: initialData.proficiencies || { skills: [], armor: [], weapons: [], tools: [] },
        expertise: initialData.expertise || [],
    });


    useEffect(() => {
        if (items.length) {
            setArmorOptions(items.filter(item => item.type === 'Armor'));
            setWeaponOptions(items.filter(item => item.type === 'Weapon'));
        }
    }, [items]);

    useEffect(() => {
        if (initialData?.items?.length) {
            const armor = initialData.items.find(i => i.type === 'Armor' && i.armorCategory !== 'Shield');
            const weapon = initialData.items.find(i => i.type === 'Weapon');
            setSelectedArmor(armor || null);
            setSelectedWeapon(weapon || null);
        }
    }, [initialData]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/data/classes.json');
                const data = await res.json();
                setAllClassFeatures(data);
            } catch (err) {
                console.error('Failed to load class features:', err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/data/class_spells.json');
                const data = await res.json();
                setClassSpellLists(data);
            } catch (err) {
                console.error('Failed to load class spells:', err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/data/subclass_features.json');
                const data = await res.json();
                setAllSubclassFeatures(data);
            } catch (err) {
                console.error('Failed to load subclass features:', err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!form.background) return setBackgroundFeatures([]);
            try {
                const res = await fetch('/data/backgrounds.json');
                const data = await res.json();
                setBackgroundFeatures(data[form.background]?.features || []);
            } catch (err) {
                console.error('Failed to load background features:', err);
            }
        })();
    }, [form.background]);

    useEffect(() => {
        setClassBasedProficiencies(getClassBasedProficiencies(form.classes || []));
    }, [form.classes]);

    const handleClassChange = (index, field, value) => {
        const updatedClasses = [...form.classes];
        updatedClasses[index] = {
            ...updatedClasses[index],
            [field]: field === 'level' ? Number(value) : value,
        };
        if (field === 'name') updatedClasses[index].subclass = '';

        setForm(prev => ({ ...prev, classes: updatedClasses }));

        const cls = updatedClasses[index];
        const features = allClassFeatures[cls.name]?.features || [];
        const unlocked = features.filter(f => f.level <= cls.level);
        const upcoming = features.filter(f => f.level > cls.level);

        let subclassUnlocked = [];
        let subclassUpcoming = [];
        if (cls.subclass && allSubclassFeatures[cls.name]?.[cls.subclass]) {
            const subclassFeatures = allSubclassFeatures[cls.name][cls.subclass];
            subclassUnlocked = subclassFeatures.filter(f => f.level <= cls.level);
            subclassUpcoming = subclassFeatures.filter(f => f.level > cls.level);
        }

        setClassFeatures(prev => {
            const updated = [...prev];
            updated[index] = { unlocked, upcoming, subclassUnlocked, subclassUpcoming };
            return updated;
        });
    };

    const handleSubclassChange = (index, subclassName) => {
        const updatedClasses = [...form.classes];
        updatedClasses[index].subclass = subclassName;
        setForm(prev => ({ ...prev, classes: updatedClasses }));

        const cls = updatedClasses[index];
        const subclassFeatures = allSubclassFeatures[cls.name]?.[subclassName] || [];
        const subclassUnlocked = subclassFeatures.filter(f => f.level <= cls.level);
        const subclassUpcoming = subclassFeatures.filter(f => f.level > cls.level);

        setClassFeatures(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                subclassUnlocked,
                subclassUpcoming,
            };
            return updated;
        });
    };

    const handleRaceChange = async (e) => {
        const selectedRace = e.target.value;
        setForm(prev => ({ ...prev, race: selectedRace }));
        if (!selectedRace) return setSpeciesFeatures([]);
        try {
            const res = await fetch('/data/species.json');
            const data = await res.json();
            setSpeciesFeatures(data[selectedRace]?.abilities || []);
        } catch (err) {
            console.error('Failed to load species data:', err);
        }
    };

    const handleStatChange = (stat, value) => {
        setForm(prev => ({
            ...prev,
            stats: { ...prev.stats, [stat]: Number(value) }
        }));
    };

    const handleSpellToggle = (className, spellName) => {
        setSelectedSpells(prev => {
            const current = prev[className] || [];
            return {
                ...prev,
                [className]: current.includes(spellName)
                    ? current.filter(sp => sp !== spellName)
                    : [...current, spellName],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                race: form.race,
                stats: form.stats,
                classes: form.classes,
                level: form.level,
                background: form.background,
                backstory: form.backstory,
                expertise: form.expertise,
                items: [selectedArmor, selectedWeapon].filter(Boolean),
                spells: Object.entries(selectedSpells).flatMap(([cls, spells]) =>
                    spells.map(spell => ({ name: spell, class: cls }))
                ),
                proficiencies: {
                    ...form.proficiencies,
                    armor: classBasedProficiencies.armor,
                    weapons: [
                        ...classBasedProficiencies.weaponCategories,
                        ...classBasedProficiencies.namedWeapons
                    ]
                }
            };
            console.log('Submitting payload:', payload);
            const res = form._id ? await updateCharacter(form._id, payload) : await createCharacter(payload);
            if (onSuccess) onSuccess(res.data);
            alert(`Character ${form._id ? 'updated' : 'created'}!`);
        } catch (err) {
            console.error(err);
            alert(`Error ${form._id ? 'updating' : 'creating'} character`);
        }
    };

    return (
        <div>
            <div className="tabs">
                {[
                    'Class', 'Species', 'Stats', 'Background', 'Proficiencies', 'Equipment',
                    ...(form.classes.some(cls => spellcastingClasses.includes(cls.name)) ? ['Spells'] : [])
                ].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={currentTab === tab ? 'active' : ''}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {currentTab === 'Class' && (
                    <ClassTab
                        form={form}
                        classOptions={classOptions}
                        allSubclassFeatures={allSubclassFeatures}
                        spellcastingClasses={spellcastingClasses}
                        classFeatures={classFeatures}
                        handleClassChange={handleClassChange}
                        handleSubclassChange={handleSubclassChange}
                        removeClass={removeClass}
                        addClass={addClass}
                    />
                )}

                {currentTab === 'Spells' && (
                    <SpellTab
                        classes={form.classes}
                        spellcastingClasses={spellcastingClasses}
                        classSpellLists={classSpellLists}
                        fullCasters={fullCasters}
                        halfCasters={halfCasters}
                        getMaxSpellLevel={getMaxSpellLevel}
                        selectedSpells={selectedSpells}
                        handleSpellToggle={handleSpellToggle}
                    />
                )}

                {currentTab === 'Species' && (
                    <SpeciesTab
                        form={form}
                        setForm={setForm}
                        raceOptions={raceOptions}
                        speciesFeatures={speciesFeatures}
                        handleRaceChange={handleRaceChange}
                    />
                )}

                {currentTab === 'Stats' && (
                    <StatsTab form={form} handleStatChange={handleStatChange} />
                )}

                {currentTab === 'Background' && (
                    <BackgroundTab
                        background={form.background}
                        setBackground={value => setForm({ ...form, background: value })}
                        backgroundFeatures={backgroundFeatures}
                        backstory={form.backstory}
                        setBackstory={value => setForm({ ...form, backstory: value })}
                    />
                )}

                {currentTab === 'Proficiencies' && (
                    <ProficienciesTab
                        proficiencies={proficiencies}
                        formProficiencies={form.proficiencies}
                        setFormProficiencies={newProfs =>
                            setForm(prev => ({
                                ...prev,
                                proficiencies: {
                                    ...prev.proficiencies,
                                    ...newProfs
                                }
                            }))
                        }
                        formExpertise={form.expertise}
                        classes={form.classes}
                        setFormExpertise={newExp =>
                            setForm(prev => ({ ...prev, expertise: newExp }))
                        }
                        classBasedProficiencies={classBasedProficiencies}
                    />
                )}

                {currentTab === 'Equipment' && (
                    <EquipmentTab
                        selectedArmor={selectedArmor}
                        setSelectedArmor={setSelectedArmor}
                        selectedWeapon={selectedWeapon}
                        setSelectedWeapon={setSelectedWeapon}
                        armorOptions={armorOptions}
                        weaponOptions={weaponOptions}
                    />
                )}

                {currentTab === 'Spells' && (
                    <SpellTab
                        classes={form.classes}
                        spellcastingClasses={spellcastingClasses}
                        getMaxSpellLevel={getMaxSpellLevel}
                        classSpellLists={classSpellLists}
                        fullCasters={fullCasters}
                        halfCasters={halfCasters}
                        selectedSpells={selectedSpells}
                        handleSpellToggle={handleSpellToggle}
                    />
                )}

                <button type="submit">Save Character</button>
            </form>
        </div>
    );
};

export default CharacterForm;
