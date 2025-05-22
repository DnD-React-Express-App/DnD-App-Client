import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteCharacter, getCharacterById } from '../services/character.service';
import axios from 'axios';

const CharacterDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <p><strong>Race:</strong> {character.race}</p>
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
