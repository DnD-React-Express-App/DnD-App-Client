import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteCharacter, getCharacterById } from '../../services/character.service';
import allProficiencies from '../../../public/data/proficiencies.json';


const CharacterDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [speciesFeatures, setSpeciesFeatures] = useState([]);
    const [classFeaturesByClass, setClassFeaturesByClass] = useState({});
    const [backgroundFeatures, setBackgroundFeatures] = useState([]);


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

    return (
        <div>
            <button onClick={() => navigate('/characters')}>← Back</button>
            <h1>{character.name}</h1>
            <p><strong>Species:</strong> {character.race}</p>
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
            <p><strong>Total Level:</strong> {character.level}</p>

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
                                                <li key={f.name}>
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
                                                <li key={f.name}>
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

            <h3>Items</h3>
            {character.items?.length ? (
                <ul>
                    {character.items.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong> ({item.type})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items equipped.</p>
            )}

            <h2>Stats</h2>
            <ul>
                {Object.entries(character.stats).map(([stat, value]) => (
                    <li key={stat}><strong>{stat}:</strong> {value}</li>
                ))}
            </ul>

            <h2>Proficiencies</h2>
            {character.proficiencies ? (
                Object.entries(allProficiencies).map(([type, list]) => (
                    <div key={type}>
                        <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {list.map(prof => {
                                const isSelected = character.proficiencies?.[type]?.includes(prof);
                                return (
                                    <li
                                        key={prof}
                                        style={{
                                            display: 'inline-block',
                                            margin: '4px 8px 4px 0',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: isSelected ? '#4caf50' : '#eee',
                                            color: isSelected ? 'white' : '#333',
                                            fontWeight: isSelected ? 'bold' : 'normal',
                                        }}
                                    >
                                        {prof}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))
            ) : (
                <p><em>No proficiencies selected.</em></p>
            )}


            <h2>Backstory</h2>
            {character.background && (
                <>
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
                </>
            )}
            <p>{character.backstory || <em>No backstory provided</em>}</p>

            <button onClick={(e) => {
                e.stopPropagation();
                navigate(`/characters/${character._id}/edit`);
            }}>Edit</button>
            <button onClick={handleDelete}>Delete Character</button>
        </div>
    );
};

export default CharacterDetail;
