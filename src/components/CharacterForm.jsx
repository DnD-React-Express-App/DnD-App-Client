import React, { useState } from 'react';
import axios from 'axios';

const CharacterForm = ({ onSuccess }) => {
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
        backstory: ''
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
            const res = await axios.post('http://localhost:5005/api/characters', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (onSuccess) onSuccess(res.data);
            alert('Character created!');
        } catch (err) {
            console.error(err);
            alert('Error creating character');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                {raceOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {form.classes.map((cls, index) => (
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
            ))}

            <button type="button" onClick={addClass}>
                + Add Class
            </button>

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

            <textarea
                value={form.backstory}
                onChange={e => setForm({ ...form, backstory: e.target.value })}
                placeholder="Backstory..."
            />

            <button type="submit">Create Character</button>
        </form>
    );
};

export default CharacterForm;
