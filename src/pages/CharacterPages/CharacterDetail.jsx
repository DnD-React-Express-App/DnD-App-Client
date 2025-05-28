import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteCharacter, getCharacterById } from '../../services/character.service';
import allProficiencies from '../../../public/data/proficiencies.json';
import {
    getModifier,
    getProficiencyBonus,
    getTotalLevel,
    skillToStatMap,
    getWeaponAttackBonus,
    getArmorClass,
    getClassBasedProficiencies,
    calculateSpellSaveDC,
    calculateTotalHP
} from '../../utils/characterUtils';
import { ItemContext } from '../../context/item.context';
import '../../CharacterDetails.css';

const CharacterDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [speciesFeatures, setSpeciesFeatures] = useState([]);
    const [classFeaturesByClass, setClassFeaturesByClass] = useState({});
    const [backgroundFeatures, setBackgroundFeatures] = useState([]);

    const { items } = useContext(ItemContext);
    const allWeapons = items.filter(i => i.type === 'Weapon');

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const res = await getCharacterById(id);
                setCharacter(res.data);
            } catch (err) {
                console.error(err);
                alert('Failed to fetch character details');
            } finally {
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    useEffect(() => {
        const fetchSpeciesFeatures = async () => {
            if (!character?.race) return;

            try {
                const res = await fetch('/data/species.json');
                const speciesData = await res.json();

                const features = speciesData[character.race]?.abilities || [];
                setSpeciesFeatures(features);
            } catch (err) {
                console.error('Failed to load species features:', err);
                setSpeciesFeatures([]);
            }
        };

        fetchSpeciesFeatures();
    }, [character?.race]);

    useEffect(() => {
        const fetchClassFeatures = async () => {
            if (!character?.classes?.length) return;

            try {
                const res = await fetch('/data/classes.json');
                const classData = await res.json();

                const features = {};

                for (const cls of character.classes) {
                    const allFeatures = classData[cls.name]?.features || [];
                    const unlocked = allFeatures.filter(f => f.level <= cls.level);
                    const upcoming = allFeatures.filter(f => f.level > cls.level);

                    features[cls.name] = { unlocked, upcoming };
                }

                setClassFeaturesByClass(features);
            } catch (err) {
                console.error('Failed to load class features:', err);
            }
        };

        fetchClassFeatures();
    }, [character?.classes]);

    useEffect(() => {
        const fetchBackgroundFeatures = async () => {
            if (!character?.background) return;

            try {
                const res = await fetch('/data/backgrounds.json');
                const backgroundData = await res.json();

                const features = backgroundData[character.background]?.features || [];
                setBackgroundFeatures(features);
            } catch (err) {
                console.error('Failed to load background features:', err);
                setBackgroundFeatures([]);
            }
        };

        fetchBackgroundFeatures();
    }, [character?.background]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            try {
                await deleteCharacter(id);
                navigate('/characters');
            } catch (err) {
                console.error('Error deleting character:', err);
                alert('Failed to delete character.');
            }
        }
    };

    if (loading) return <p>Loading character...</p>;
    if (!character) return <p>Character not found</p>;

    const classBasedProfs = getClassBasedProficiencies(character.classes || []);
    const totalLevel = character.classes.reduce((sum, cls) => sum + cls.level, 0);
    const profBonus = getProficiencyBonus(totalLevel);
    const combinedWeaponProfs = [
        ...classBasedProfs.weaponCategories,
        ...classBasedProfs.namedWeapons,
    ];

    const conMod = getModifier(character.stats.constitution);
    const totalHP = calculateTotalHP(character.classes, conMod);

    return (
        <div className="character-container">
            <div className="character-header">
                <button onClick={() => navigate('/characters')}>← Back</button>
                <div className="action-buttons">
                    <button className="edit-button" onClick={() => navigate(`/characters/${character._id}/edit`)}>Edit</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                </div>
            </div>

            <h1 className="character-title">{character.name}</h1>

            <div className="section">
                <h2>Species</h2>
                <p>{character.race}</p>
                {speciesFeatures.length > 0 && (
                    <>
                        <h3>Species Features</h3>
                        <ul>
                            {speciesFeatures.map((feature) => (
                                <li key={feature._id || feature.name}>
                                    <strong>{feature.name}:</strong> {feature.description}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="section">
                <h2>Level</h2>
                <p><strong>Total Level:</strong> {totalLevel}</p>

            <p><strong>HP:</strong> {totalHP}</p>
            </div>

            <div className="section">
                <h2>Classes</h2>
                <ul>
                    {character.classes.map((cls, i) => (
                        <li key={i}>
                            <strong>{cls.name}</strong> (Level {cls.level})
                            {classFeaturesByClass[cls.name] && (
                                <div style={{ marginLeft: '1rem' }}>
                                    {classFeaturesByClass[cls.name].unlocked.length > 0 && (
                                        <>
                                            <strong>Unlocked Features:</strong>
                                            <ul>
                                                {classFeaturesByClass[cls.name].unlocked.map(f => (
                                                    <li key={`${f.name}-${f.level}`}>
                                                        <strong>{f.name}</strong> (Lv {f.level}): {f.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    {classFeaturesByClass[cls.name].upcoming.length > 0 && (
                                        <>
                                            <strong>Upcoming Features:</strong>
                                            <ul>
                                                {classFeaturesByClass[cls.name].upcoming.map(f => (
                                                    <li key={`${f.name}-${f.level}`}>
                                                        <strong>{f.name}</strong> (Lv {f.level}): {f.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

            <p><strong>Initiative:</strong> {getModifier(character.stats.dexterity) >= 0 ? '+' : ''}{getModifier(character.stats.dexterity)}</p>
            </div>

            <div className="section">
                <h3>Equipment</h3>
                {character.items?.length ? (
                    <ul>
                        {character.items.map((item) => (
                            <li key={item._id}>
                                <strong>{item.name}</strong> ({item.type})
                                {item.type === 'Weapon' && (
                                    <span style={{ marginLeft: '8px', color: 'gray' }}>
                                        Attack Bonus: +{getWeaponAttackBonus(character, item)}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No items equipped.</p>
                )}
            </div>

            <div className="section">
                <h3>Spells</h3>
                {character.spells?.length ? (
                    <>
                        <p><strong>Spell Save DC:</strong> {calculateSpellSaveDC(character, totalLevel)}</p>
                        <ul>
                            {character.spells.map((spell, idx) => (
                                <li key={idx}>{spell.name} ({spell.class})</li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No spells selected.</p>
                )}
            </div>
            <div className="section">
                <h2>Defense</h2>
                <p><strong>AC:</strong> {getArmorClass(character)}</p>
            </div>

            <div className="section">
                <h2>Stats</h2>
                <div className="stat-block">
                    {Object.entries(character.stats).map(([stat, value]) => {
                        const mod = getModifier(value);
                        return (
                            <div className="stat" key={stat}>
                                {stat.toUpperCase()}
                                <span>{value} ({mod >= 0 ? '+' : ''}{mod})</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="section">
                <h2>Proficiencies</h2>
                {character.proficiencies ? (
                    Object.entries(allProficiencies).map(([type, list]) => {
                        if (type === 'weapons') {
                            const filteredWeapons = list.filter(prof => {
                                if (classBasedProfs.weaponCategories.includes(prof)) return true;

                                const isNamed =
                                    character.proficiencies?.weapons?.includes(prof) ||
                                    classBasedProfs.namedWeapons.includes(prof);

                                if (!isNamed) return false;

                                const weaponEntry = allWeapons.find(w => w.weaponType === prof);
                                const weaponCategory = weaponEntry?.weaponClass;

                                if (weaponCategory && classBasedProfs.weaponCategories.includes(weaponCategory)) return false;

                                return true;
                            });

                            return (
                                <div key="weapons">
                                    <strong>Weapons:</strong>
                                    <ul className="inline-list">
                                        {filteredWeapons.map(prof => (
                                            <li key={prof} className="proficiency-chip selected">{prof}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        }

                        return (
                            <div key={type}>
                                <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong>
                                <ul className="inline-list">
                                    {list.map(prof => {
                                        const isSelected =
                                            character.proficiencies?.[type]?.includes(prof) ||
                                            (type === 'armor' && classBasedProfs.armor.includes(prof));

                                        const isSkill = type === 'skills';
                                        const statKey = isSkill ? skillToStatMap[prof] : null;
                                        const statValue = isSkill && statKey ? character.stats[statKey] : null;
                                        const baseMod = isSkill && statValue !== null ? getModifier(statValue) : null;
                                        const hasExpertise = character.expertise?.includes(prof);
                                        const totalMod = isSkill && statValue !== null
                                            ? baseMod + (isSelected ? (hasExpertise ? profBonus * 2 : profBonus) : 0)
                                            : null;

                                        return (
                                            <li
                                                key={prof}
                                                className={`proficiency-chip${isSelected ? ' selected' : ''}`}
                                            >
                                                {prof}
                                                {isSkill && statValue !== null && (
                                                    <span>
                                                        ({totalMod >= 0 ? '+' : ''}{totalMod})
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })
                ) : (
                    <p><em>No proficiencies selected.</em></p>
                )}
            </div>

            {character.background && (
                <div className="section">
                    <h2>Background</h2>
                    <p><strong>{character.background}</strong></p>
                    {backgroundFeatures.length > 0 && (
                        <>
                            <h3>Background Features</h3>
                            <ul>
                                {backgroundFeatures.map((feature, index) => (
                                    <li key={feature._id || feature.name || index}>
                                        <strong>{feature.name}:</strong> {feature.description}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}

            <div className="section">
                <h2>Backstory</h2>
                <p>{character.backstory || <em>No backstory provided</em>}</p>
            </div>
        </div>
    );

};

export default CharacterDetail;
