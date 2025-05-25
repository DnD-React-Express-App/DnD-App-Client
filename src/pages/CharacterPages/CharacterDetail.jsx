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
                    <li key={i}>{cls.name} (Level {cls.level})</li>
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
