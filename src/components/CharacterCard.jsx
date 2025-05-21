import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCharacter } from '../services/character.service';
import '../CharacterCard.css';

const CharacterCard = ({ character, onDelete }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/characters/${character._id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this character?')) {
            try {
                await deleteCharacter(character._id);
                if (onDelete) onDelete(character._id);
            } catch (err) {
                console.error('Error deleting character:', err);
                alert('Failed to delete character.');
            }
        }
    };

    return (
        <div className="character-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <h2>{character.name}</h2>
            <p><strong>Race:</strong> {character.race}</p>
            <p><strong>Level:</strong> {character.level}</p>
            <p><strong>Class:</strong> {character.classes.map(c => `${c.name} ${c.level}`).join(', ')}</p>
            <p><strong>STR:</strong> {character.stats.strength}</p>
            <button onClick={(e) => {
                e.stopPropagation();
                navigate(`/characters/${character._id}/edit`);
            }}>Edit</button>
            {onDelete && (
                <button onClick={handleDelete}>Delete</button>
            )}
        </div>
    );
};

export default CharacterCard;