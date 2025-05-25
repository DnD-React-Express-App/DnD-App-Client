import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ItemContext } from '../../context/item.context';
import { createCharacter, updateCharacter } from '../../services/character.service';
import proficiencies from '../../../public/data/proficiencies.json';


const CharacterForm = ({ onSuccess, initialData = {} }) => {

    const { items, isLoading } = useContext(ItemContext);

    const [currentTab, setCurrentTab] = useState('Basics');

    const [armorOptions, setArmorOptions] = useState([]);
    const [weaponOptions, setWeaponOptions] = useState([]);
    const [selectedArmor, setSelectedArmor] = useState(null);
    const [selectedWeapon, setSelectedWeapon] = useState(null);
    const [speciesFeatures, setSpeciesFeatures] = useState([]);

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
        backstory: '',
        proficiencies: {
            skills: [],
            armor: [],
            weapons: [],
            tools: []
        },
        ...initialData,
    });

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

    const classOptions = [
        'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
        'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard',
    ];
    const raceOptions = [
        'Human', 'Elf', 'Half-Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Orc', 'Dragonborn',
        'Tiefling', 'Aasimar', 'Genasi', 'Goliath', 'Tabaxi', 'Triton', 'Firbolg',
        'Kenku', 'Lizardfolk', 'Goblin', 'Orc', 'Bugbear'
    ];

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');

            const payload = {
                ...form,
                items: [selectedArmor, selectedWeapon].filter(Boolean),
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
                {['Class', 'Species', 'Stats', 'Background', 'Proficiencies', 'Equipment'].map(tab => (
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
                    <>
                        {
                            form.classes.map((cls, index) => (
                                <div key={index} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                                    <select
                                        value={cls.name}
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

                                    {form.classes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeClass(index)}
                                            style={{ marginLeft: '0.5rem' }}
                                            aria-label={`Remove class ${index + 1}`}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))
                        }

                        <button type="button" onClick={addClass}>
                            + Add Class
                        </button>
                    </>
                )}

                {currentTab === 'Species' && (
                    <>
                        <input
                            placeholder="Character Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />

                        <select
                            value={form.race}
                            onChange={handleRaceChange}
                        >
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



                {currentTab === 'Stats' && (
                    <>
                        <div>
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
                        </div>
                    </>
                )}

                {currentTab === "Equipment" && (
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

                {currentTab === 'Background' && (
                    <>
                        <textarea
                            placeholder="Enter backstory"
                            value={form.backstory}
                            onChange={e => setForm({ ...form, backstory: e.target.value })}
                            rows={5}
                            style={{ width: '100%', marginTop: '1rem' }}
                        />
                    </>
                )}

                <button type="submit">Save Character</button>
            </form>
        </div>
    );
};

export default CharacterForm;
