import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ItemContext } from '../../context/item.context';
import { createCharacter, updateCharacter } from '../../services/character.service';
import proficiencies from '../../../public/data/proficiencies.json';

const spellcastingClasses = [
    'Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Paladin', 'Ranger', 'Warlock'
];

const CharacterForm = ({ onSuccess, initialData = {} }) => {
    const { items, isLoading } = useContext(ItemContext);

    const [currentTab, setCurrentTab] = useState('Basics');
    const [armorOptions, setArmorOptions] = useState([]);
    const [weaponOptions, setWeaponOptions] = useState([]);
    const [selectedArmor, setSelectedArmor] = useState(null);
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [speciesFeatures, setSpeciesFeatures] = useState([]);
    const [allClassFeatures, setAllClassFeatures] = useState({});
    const [classFeatures, setClassFeatures] = useState({});
    const [backgroundFeatures, setBackgroundFeatures] = useState([]);
    const [classSpellLists, setClassSpellLists] = useState({});
    const [selectedSpells, setSelectedSpells] = useState({});

    const [form, setForm] = useState({
        name: '',
        race: '',
        stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        },
        classes: [{ name: '', level: 1 }],
        level: 1,
        background: '',
        backstory: '',
        proficiencies: {
            skills: [],
            armor: [],
            weapons: [],
            tools: []
        },
        ...initialData,
    });

    const classOptions = [
        'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
        'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
    ];

    const raceOptions = [
        'Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Dragonborn',
        'Tiefling', 'Aasimar', 'Genasi', 'Goliath', 'Tabaxi', 'Triton', 'Firbolg',
        'Kenku', 'Lizardfolk', 'Goblin', 'Orc', 'Bugbear'
    ];

    useEffect(() => {
        if (items.length > 0) {
            setArmorOptions(items.filter(item => item.type === 'Armor'));
            setWeaponOptions(items.filter(item => item.type === 'Weapon'));
        }
    }, [items]);

    useEffect(() => {
        if (initialData && initialData._id) {
            setForm({ ...form, ...initialData });
        }
    }, [initialData]);

    useEffect(() => {
        const fetchClassFeatures = async () => {
            try {
                const res = await fetch('/data/classes.json');
                const data = await res.json();
                setAllClassFeatures(data);
            } catch (err) {
                console.error('Failed to load class features:', err);
            }
        };

        fetchClassFeatures();
    }, []);

    useEffect(() => {
        const fetchSpellLists = async () => {
            try {
                const res = await fetch('/data/class_spells.json');
                const data = await res.json();
                setClassSpellLists(data);
            } catch (err) {
                console.error('Failed to load class spell lists:', err);
            }
        };

        fetchSpellLists();
    }, []);

    const handleRaceChange = async (e) => {
        const selectedRace = e.target.value;
        setForm(prev => ({ ...prev, race: selectedRace }));

        if (!selectedRace) {
            setSpeciesFeatures([]);
            return;
        }

        try {
            const res = await fetch('/data/species.json');
            const speciesData = await res.json();
            const features = speciesData[selectedRace]?.abilities || [];
            setSpeciesFeatures(features);
        } catch (err) {
            console.error('Failed to load species data:', err);
            setSpeciesFeatures([]);
        }
    };

    const handleStatChange = (stat, value) => {
        setForm(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [stat]: Number(value)
            }
        }));
    };

    const handleClassChange = (index, field, value) => {
        const updatedClasses = form.classes.map((cls, i) => {
            if (i === index) {
                return {
                    ...cls,
                    [field]: field === 'level' ? Number(value) : value
                };
            }
            return cls;
        });

        setForm(prev => ({ ...prev, classes: updatedClasses }));

        const selectedClass = field === 'name' ? value : updatedClasses[index].name;
        const selectedLevel = field === 'level' ? Number(value) : updatedClasses[index].level;

        if (!selectedClass || !allClassFeatures[selectedClass]) return;

        const allFeatures = allClassFeatures[selectedClass].features || [];
        const unlocked = allFeatures.filter(f => f.level <= selectedLevel);
        const upcoming = allFeatures.filter(f => f.level > selectedLevel);

        setClassFeatures(prev => ({
            ...prev,
            [index]: { unlocked, upcoming }
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

    const addClass = () => {
        setForm(prev => ({
            ...prev,
            classes: [...prev.classes, { name: '', level: 1 }]
        }));
    };

    const removeClass = (index) => {
        setForm(prev => ({
            ...prev,
            classes: prev.classes.filter((_, i) => i !== index)
        }));
    };

    useEffect(() => {
        const fetchBackgroundFeatures = async () => {
            if (!form.background) {
                setBackgroundFeatures([]);
                return;
            }

            try {
                const res = await fetch('/data/backgrounds.json');
                const backgroundsData = await res.json();
                const features = backgroundsData[form.background]?.features || [];
                setBackgroundFeatures(features);
            } catch (err) {
                console.error('Failed to load background features:', err);
                setBackgroundFeatures([]);
            }
        };

        fetchBackgroundFeatures();
    }, [form.background]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');

            const payload = {
                ...form,
                items: [selectedArmor, selectedWeapon].filter(Boolean),
                spells: selectedSpells,
            };

            let res;
            if (form._id) {
                res = await updateCharacter(form._id, payload);
            } else {
                res = await createCharacter(payload);
            }

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
                {['Class', 'Species', 'Stats', 'Background', 'Proficiencies', 'Equipment']
                    .concat(form.classes.some(cls => spellcastingClasses.includes(cls.name)) ? ['Spells'] : [])
                    .map(tab => (
                        <button
                            key={tab}
                            onClick={() => setCurrentTab(tab)}
                            className={currentTab === tab ? 'active' : ''}
                        >
                            {tab}
                        </button>
                    ))
                }
            </div>

            <form onSubmit={handleSubmit}>
                {currentTab === 'Class' && (
                    <>
                        {form.classes.map((cls, index) => {
                            const className = cls.name;
                            const isSpellcaster = spellcastingClasses.includes(className);
                            return (
                                <div key={index} style={{ marginBottom: '2rem' }}>
                                    <select
                                        value={className}
                                        onChange={e => handleClassChange(index, 'name', e.target.value)}
                                    >
                                        <option value="">Select Class</option>
                                        {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>

                                    <input
                                        type="number"
                                        min="1"
                                        value={cls.level}
                                        onChange={e => handleClassChange(index, 'level', e.target.value)}
                                        placeholder="Class Level"
                                        style={{ width: '80px', marginLeft: '0.5rem' }}
                                    />

                                    {classFeatures[index]?.unlocked?.length > 0 && (
                                        <div>
                                            <strong>Unlocked Features:</strong>
                                            <ul>
                                                {classFeatures[index].unlocked.map(feature => (
                                                    <li key={feature.name}>
                                                        <strong>{feature.name}</strong> (Level {feature.level}): {feature.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {form.classes.length > 1 && (
                                        <button type="button" onClick={() => removeClass(index)}>Remove</button>
                                    )}
                                </div>
                            );
                        })}
                        <button type="button" onClick={addClass}>+ Add Class</button>
                    </>
                )}

                {currentTab === 'Spells' && (
                    <>
                        <h3>Spell Selection</h3>
                        {form.classes
                            .filter(cls => spellcastingClasses.includes(cls.name))
                            .map((cls, index) => {
                                const className = cls.name;
                                const spells = classSpellLists[className] || [];
                                return (
                                    <div key={index} style={{ marginBottom: '2rem' }}>
                                        <h4>{className}</h4>
                                        {spells.length > 0 ? (
                                            <ul>
                                                {spells.map(spell => (
                                                    <li key={spell.name}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSpells[className]?.includes(spell.name) || false}
                                                                onChange={() => handleSpellToggle(className, spell.name)}
                                                            />
                                                            {spell.name} (Level {spell.level}, {spell.school})
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No spells found for {className}.</p>
                                        )}
                                    </div>
                                );
                            })}
                    </>
                )}

                {currentTab === 'Species' && (
                    <>
                        <input
                            placeholder="Character Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                        <select value={form.race} onChange={handleRaceChange}>
                            <option value="">Select Race</option>
                            {raceOptions.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        {speciesFeatures.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <strong>Racial Features:</strong>
                                <ul>
                                    {speciesFeatures.map(feature => (
                                        <li key={feature._id}>
                                            <strong>{feature.name}</strong>: {feature.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {currentTab === 'Stats' && (
                    <>
                        {Object.keys(form.stats).map(stat => (
                            <div key={stat}>
                                <label>{stat}</label>
                                <input
                                    type="number"
                                    value={form.stats[stat]}
                                    onChange={e => handleStatChange(stat, e.target.value)}
                                />
                            </div>
                        ))}
                    </>
                )}

                {currentTab === 'Background' && (
                    <>
                        <label>Select Background:</label>
                        <select
                            value={form.background}
                            onChange={e => setForm({ ...form, background: e.target.value })}
                        >
                            <option value="">-- Select Background --</option>
                            <option value="Acolyte">Acolyte</option>
                            <option value="Criminal">Criminal</option>
                            <option value="Folk Hero">Folk Hero</option>
                            <option value="Noble">Noble</option>
                            <option value="Outlander">Outlander</option>
                            <option value="Sage">Sage</option>
                            <option value="Soldier">Soldier</option>
                        </select>

                        {backgroundFeatures.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <strong>Background Features:</strong>
                                <ul>
                                    {backgroundFeatures.map((feature, idx) => (
                                        <li key={feature._id || feature.name || idx}>
                                            <strong>{feature.name}</strong>: {feature.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <textarea
                            placeholder="Enter backstory"
                            value={form.backstory}
                            onChange={e => setForm({ ...form, backstory: e.target.value })}
                            rows={5}
                            style={{ width: '100%', marginTop: '1rem' }}
                        />
                    </>
                )}

                {currentTab === 'Proficiencies' && (
                    <>
                        <h3>Proficiencies</h3>
                        {Object.entries(proficiencies).map(([type, list]) => (
                            <div key={type} style={{ marginBottom: '1rem' }}>
                                <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                                {list.map(item => (
                                    <label key={item} style={{ display: 'block' }}>
                                        <input
                                            type="checkbox"
                                            value={item}
                                            checked={form.proficiencies[type]?.includes(item)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                setForm(prev => ({
                                                    ...prev,
                                                    proficiencies: {
                                                        ...prev.proficiencies,
                                                        [type]: isChecked
                                                            ? [...prev.proficiencies[type], item]
                                                            : prev.proficiencies[type].filter(i => i !== item)
                                                    }
                                                }));
                                            }}
                                        />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        ))}
                    </>
                )}

                {currentTab === 'Equipment' && (
                    <>
                        <label>Select Armor:</label>
                        <select
                            value={selectedArmor}
                            onChange={(e) => setSelectedArmor(e.target.value)}
                        >
                            <option value="">-- Select Armor --</option>
                            {armorOptions.map(armor => (
                                <option key={armor._id} value={armor._id}>
                                    {armor.name}
                                </option>
                            ))}
                        </select>

                        <label>Select Weapon:</label>
                        <select
                            value={selectedWeapon}
                            onChange={(e) => setSelectedWeapon(e.target.value)}
                        >
                            <option value="">-- Select Weapon --</option>
                            {weaponOptions.map(weapon => (
                                <option key={weapon._id} value={weapon._id}>
                                    {weapon.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit">Save Character</button>
            </form>
        </div>
    );
};

export default CharacterForm;
