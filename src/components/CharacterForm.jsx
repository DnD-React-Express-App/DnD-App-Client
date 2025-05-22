import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ItemContext } from '../context/item.context';
import { createCharacter, updateCharacter } from '../services/character.service';

const CharacterForm = ({ onSuccess, initialData = {} }) => {

    const { items, isLoading } = useContext(ItemContext);

    const [currentTab, setCurrentTab] = useState('Basics');

    const [armorOptions, setArmorOptions] = useState([]);
    const [weaponOptions, setWeaponOptions] = useState([]);
    const [selectedArmor, setSelectedArmor] = useState(null);
    const [selectedWeapon, setSelectedWeapon] = useState(null);

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
    const raceAbilities = {
        Human: "Versatile: +1 to all ability scores.",
        Elf: "Darkvision, Keen Senses, Fey Ancestry.",
        Dwarf: "Darkvision, Dwarven Resilience, Tool Proficiency.",
        Halfling: "Lucky, Brave, Halfling Nimbleness.",
        Gnome: "Darkvision, Gnome Cunning.",
        HalfElf: "Darkvision, Fey Ancestry, Skill Versatility.",
        HalfOrc: "Darkvision, Relentless Endurance, Savage Attacks.",
        Dragonborn: "Draconic Ancestry, Breath Weapon, Damage Resistance.",
        Tiefling: "Darkvision, Hellish Resistance, Infernal Legacy.",
        Aasimar: "Celestial Resistance, Healing Hands, Light Bearer.",
        Genasi: "Elemental Resistance and innate spells (varies by type).",
        Goliath: "Powerful Build, Stone's Endurance, Mountain Born.",
        Tabaxi: "Feline Agility, Cat's Claws, Cat's Talent.",
        Triton: "Amphibious, Control Air and Water, Guardian of the Depths.",
        Firbolg: "Firbolg Magic, Hidden Step, Powerful Build.",
        Kenku: "Expert Forgery, Kenku Training, Mimicry.",
        Lizardfolk: "Bite, Cunning Artisan, Hold Breath, Natural Armor.",
        Goblin: "Fury of the Small, Nimble Escape.",
        Orc: "Aggressive, Menacing, Powerful Build.",
        Bugbear: "Long-Limbed, Powerful Build, Sneaky."
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
                {['Class', 'Species', 'Stats', 'Background', 'Equipment'].map(tab => (
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
                            onChange={e => setForm({ ...form, race: e.target.value })}
                        >
                            <option value="">Select Race</option>
                            {raceOptions.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>

                        {form.race && raceAbilities[form.race] && (
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                <strong>{form.race} Abilities:</strong>
                                <p>{raceAbilities[form.race]}</p>
                            </div>
                        )}
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
